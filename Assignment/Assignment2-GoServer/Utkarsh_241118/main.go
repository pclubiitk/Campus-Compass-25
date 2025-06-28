package main

import (
    "log"
    "net/http"

    "github.com/gorilla/mux"
)

func main() {
    initDB()
    InitRabbitMQ()
    StartConsumer()

    r := mux.NewRouter()

    r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Server is up and running!"))
    }).Methods("GET")

    r.HandleFunc("/items", getItems).Methods("GET")
    r.HandleFunc("/items/{id}", getItem).Methods("GET")
    r.HandleFunc("/items", addItem).Methods("POST")
    r.HandleFunc("/items/{id}", updateItem).Methods("PUT")
    r.HandleFunc("/items/{id}", deleteItem).Methods("DELETE")

    r.HandleFunc("/send", func(w http.ResponseWriter, r *http.Request) {
        msg := r.URL.Query().Get("msg")
        if msg == "" {
            msg = "Hello from /send"
        }
        if err := PublishToQueue(msg); err != nil {
            http.Error(w, "Failed to publish", http.StatusInternalServerError)
            return
        }
        w.Write([]byte("Published to queue"))
    }).Methods("GET")

    log.Println("🚀 Server running at http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", r))
}
