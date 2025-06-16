package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

var db *sql.DB

func main() {
	var err error
	connStr := "host=localhost port=5432 user=vineesh password=password123 dbname=simple_crud sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal("DB not reachable:", err)
	}

	router := mux.NewRouter()
	router.HandleFunc("/create", createStudent).Methods("POST")
	router.HandleFunc("/read/{roll}", readStudent).Methods("GET")
	router.HandleFunc("/update", updateStudent).Methods("PUT")
	router.HandleFunc("/delete/{roll}", deleteStudent).Methods("DELETE")

	log.Println("Server running at http://localhost:8080")
	http.ListenAndServe(":8080", router)
}
