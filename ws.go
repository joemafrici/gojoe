package main

import (
	"bytes"
	"html/template"
	"log"
	"time"

	"golang.org/x/net/websocket"
)

type Server struct {
	conns map[*websocket.Conn]bool
}

func NewServer() *Server {
	return &Server{
		conns: make(map[*websocket.Conn]bool),
	}
}

func (s *Server) handleDataFeed(ws *websocket.Conn) {
	log.Println("new incoming conection to data feed", ws.RemoteAddr())
	s.conns[ws] = true
	defer delete(s.conns, ws)

	t := template.Must(template.ParseFiles("templates/hmon.html"))
	for {
		payload, err := GetSysInfo()
		if err != nil {
			log.Println("GetSysInfo: ", err.Error())
			time.Sleep(time.Second * 5)
			continue
		}
		log.Printf("Total mem %v Desc %v", payload.MemTotal.Val, payload.MemTotal.Desc)
		var buf bytes.Buffer
		err = t.ExecuteTemplate(&buf, "hardware-stats", payload)
		if err != nil {
			log.Println("ExecuteTemplate:", err.Error())
			time.Sleep(time.Second * 5)
			continue
		}

		err = websocket.Message.Send(ws, buf.String())
		if err != nil {
			log.Println("Send:", err.Error())
		}
		log.Println("message sent to client")
		time.Sleep(time.Second * 1)
	}
}
