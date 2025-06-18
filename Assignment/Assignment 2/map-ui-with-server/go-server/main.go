package main

import (
	"fmt"
	"log"
	"net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    fmt.Fprintln(w, `{"message": "Hello from Go backend!"}`)
}

func withCORS(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        next(w, r)
    }
}

func main() {
    http.HandleFunc("/api/hello", withCORS(helloHandler))

    fmt.Println("🚀 Go server running at http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
