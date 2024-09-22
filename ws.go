package main

import (
	"bytes"
	"context"
	//"fmt"
	"html/template"
	"log"
	"net/http"
	"time"

	"github.com/coder/websocket"
)

type Client struct {
	conn *websocket.Conn
	send chan []byte
}

type Server struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
}

func NewServer() *Server {
	return &Server{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (s *Server) Run() {
	for {
		select {
		case client := <-s.register:
			s.clients[client] = true
		case client := <-s.unregister:
			if _, ok := s.clients[client]; ok {
				delete(s.clients, client)
				close(client.send)
			}
		case message := <-s.broadcast:
			for client := range s.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(s.clients, client)
				}
			}
		}
	}
}

func (s *Server) Writer() {
	ticker := time.NewTicker(time.Second / 2)
	defer ticker.Stop()

	t := template.Must(template.ParseFiles("templates/hmon.html"))
	log.Println("parsed hmon template")
	for {
		<-ticker.C
		payload, err := GetSysInfo()
		if err != nil {
			log.Println("GetSysInfo: ", err.Error())
			time.Sleep(time.Second * 5)
			continue
		}
		var buf bytes.Buffer
		err = t.ExecuteTemplate(&buf, "hardware-stats", payload)
		if err != nil {
			log.Println("ExecuteTemplate:", err.Error())
			time.Sleep(time.Second * 5)
			continue
		}
		s.broadcast <- buf.Bytes()
	}
}

func (s *Server) ServeWS(w http.ResponseWriter, r *http.Request) {
	log.Println("new incoming conection to data feed", r.URL.Path)
	c, err := websocket.Accept(w, r, nil)
	if err != nil {
		log.Println("Accept:", err.Error())
		return
	}

	client := &Client{conn: c, send: make(chan []byte, 256)}
	s.register <- client

	go client.WritePump(s)
}

func (c *Client) WritePump(s *Server) {
	defer func() {
		c.conn.Close(websocket.StatusNormalClosure, "")
		s.unregister <- c
	}()

	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				c.conn.Write(context.Background(), websocket.MessageType(websocket.StatusNormalClosure), nil)
				return
			}

			err := c.conn.Write(context.Background(), websocket.MessageText, message)
			if err != nil {
				log.Println("Write:", err.Error())
				return
			}
		}
	}
}
