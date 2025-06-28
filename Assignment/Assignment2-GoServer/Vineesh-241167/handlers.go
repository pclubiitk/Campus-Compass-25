package main

import (

	"encoding/json"
	"net/http"


	"github.com/gorilla/mux"
)

type Student struct {
	Roll int    `json:"roll"`
	Name string `json:"name"`
}

func createStudent(w http.ResponseWriter, r *http.Request) {
	var s Student
	_ = json.NewDecoder(r.Body).Decode(&s)
	_, err := db.Exec("INSERT INTO students (roll, name) VALUES ($1, $2)", s.Roll, s.Name)
	if err != nil {
		http.Error(w, "Error inserting", http.StatusInternalServerError)
		return
	}
	sendMessage("Student added")
	w.Write([]byte("Student created"))
}

func readStudent(w http.ResponseWriter, r *http.Request) {
	roll := mux.Vars(r)["roll"]
	row := db.QueryRow("SELECT name FROM students WHERE roll = $1", roll)

	var name string
	if err := row.Scan(&name); err != nil {
		http.Error(w, "Student not found", http.StatusNotFound)
		return
	}
	sendMessage("Student fetched")
	w.Write([]byte("Name: " + name))
}

func updateStudent(w http.ResponseWriter, r *http.Request) {
	var s Student
	_ = json.NewDecoder(r.Body).Decode(&s)
	_, err := db.Exec("UPDATE students SET name = $1 WHERE roll = $2", s.Name, s.Roll)
	if err != nil {
		http.Error(w, "Error updating", http.StatusInternalServerError)
		return
	}
	sendMessage("Student updated")
	w.Write([]byte("Student updated"))
}

func deleteStudent(w http.ResponseWriter, r *http.Request) {
	roll := mux.Vars(r)["roll"]
	_, err := db.Exec("DELETE FROM students WHERE roll = $1", roll)
	if err != nil {
		http.Error(w, "Error deleting", http.StatusInternalServerError)
		return
	}
	sendMessage("Student deleted")
	w.Write([]byte("Student deleted"))
}
