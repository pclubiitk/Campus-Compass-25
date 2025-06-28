package main

import (
    "database/sql"
    "encoding/json"
    "log"
    "net/http"
    "strconv"

    "github.com/gorilla/mux"
    _ "github.com/lib/pq"
)

type Student struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
    Age  int    `json:"age"`
}

var db *sql.DB

func initDB() {
    var err error
    connStr := "postgres://utkarsh:secret@localhost:5432/mydb?sslmode=disable"
    db, err = sql.Open("postgres", connStr)
    if err != nil {
        panic(err)
    }
    if err = db.Ping(); err != nil {
        panic(err)
    }
}

func getItems(w http.ResponseWriter, r *http.Request) {
    rows, err := db.Query("SELECT id, name, age FROM students")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var students []Student
    for rows.Next() {
        var student Student
        if err := rows.Scan(&student.ID, &student.Name, &student.Age); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        students = append(students, student)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(students)
}

func getItem(w http.ResponseWriter, r *http.Request) {
    id := mux.Vars(r)["id"]

    var student Student
    err := db.QueryRow("SELECT id, name, age FROM students WHERE id = $1", id).Scan(&student.ID, &student.Name, &student.Age)
    if err != nil {
        http.Error(w, "Student not found", http.StatusNotFound)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(student)
}

func addItem(w http.ResponseWriter, r *http.Request) {
    var student Student
    if err := json.NewDecoder(r.Body).Decode(&student); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    err := db.QueryRow("INSERT INTO students (name, age) VALUES ($1, $2) RETURNING id", student.Name, student.Age).Scan(&student.ID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Publish add event to RabbitMQ
    msg := "Added student: ID=" + strconv.Itoa(student.ID) + ", Name=" + student.Name
    if err := PublishToQueue(msg); err != nil {
        log.Printf("Failed to publish add message: %v", err)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(student)
}

func updateItem(w http.ResponseWriter, r *http.Request) {
    id := mux.Vars(r)["id"]

    var student Student
    if err := json.NewDecoder(r.Body).Decode(&student); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    _, err := db.Exec("UPDATE students SET name = $1, age = $2 WHERE id = $3", student.Name, student.Age, id)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Write([]byte("Student updated"))
}

func deleteItem(w http.ResponseWriter, r *http.Request) {
    id := mux.Vars(r)["id"]

    var name string
    err := db.QueryRow("SELECT name FROM students WHERE id = $1", id).Scan(&name)
    if err != nil {
        http.Error(w, "Student not found", http.StatusNotFound)
        return
    }

    _, err = db.Exec("DELETE FROM students WHERE id = $1", id)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    msg := "Deleted student: ID=" + id + ", Name=" + name
    if err := PublishToQueue(msg); err != nil {
        log.Printf("Failed to publish delete message: %v", err)
    }

    w.Write([]byte("Student deleted"))
}
