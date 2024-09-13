package main

import (
	"encoding/json"
	"html/template"
	"io"
	"log"
	"net/http"
)

type PageData struct {
	Title         string
	ContentURL    string
	SearchResults []SearchResult
}
type SearchResult struct {
	Filename   string   `json:"filename"`
	Similarity float32  `json:"similarity"`
	Snippets   []string `json:"snippets"`
}

func main() {
	port := ":7002"
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	http.HandleFunc("/", logging(handleIndex))
	http.HandleFunc("/projects", logging(handleProjects))
	http.HandleFunc("/search", logging(handleSearch))
	log.Println("Server listening on port ", port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatal("ListentAndServe:", err)
	}
}
func renderTemplate(w http.ResponseWriter, r *http.Request, tmpl string, data PageData) {
	log.Println("in renderTemplate")
	if r.Header.Get("HX-Request") == "true" {
		renderPartial(w, tmpl, data)
	} else {
		renderFull(w, tmpl, data)
	}

}

// helper function for renderTemplate
func renderFull(w http.ResponseWriter, tmpl string, data PageData) {
	ts, err := template.ParseFiles("templates/"+tmpl+".html", "templates/layout.html", "templates/navbar.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = ts.ExecuteTemplate(w, "layout", data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// helper function for renderTemplate
func renderPartial(w http.ResponseWriter, tmpl string, data PageData) {
	log.Println("parsing templates/" + tmpl + ".html")
	t := template.Must(template.ParseFiles("templates/" + tmpl + ".html"))
	err := t.ExecuteTemplate(w, "content", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func handleIndex(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, r, "home", PageData{})
}

func handleProjects(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, r, "projects", PageData{Title: "Projects", ContentURL: "/projects"})
}

func handleSearch(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("query")

	if query == "" || r.Header.Get("HX-Request") == "false" {
		renderTemplate(w, r, "search", PageData{})
		return
	}

	results, err := fetchSearchResults(r.RequestURI)
	if err != nil {
		log.Println("fetchSearchResults: ", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	t := template.Must(template.ParseFiles("templates/search.html"))
	err = t.ExecuteTemplate(w, "search_results", results)
	if err != nil {
		log.Println("ExecuteTemplate: ", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
func fetchSearchResults(query string) ([]SearchResult, error) {
	resp, err := http.Get("http://localhost:7878" + query)
	if err != nil {
		log.Println("Get: ", err.Error())
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	var results []SearchResult
	err = json.Unmarshal(body, &results)
	if err != nil {
		log.Println("Unmarshal: ", err.Error())
		return nil, err
	}

	return results, nil
}

func logging(f http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request %v for %v from %v\n", r.Method, r.RequestURI, r.RemoteAddr)
		if r.Header.Get("HX-Request") == "true" {
			log.Println("is an htmx request")
		}
		f(w, r)
	}
}
