package main

import (
	"context"
	"log"
	"time"
    "net/http"
	"github.com/gin-gonic/gin"
	"github.com/rabbitmq/amqp091-go"
	"database/sql"
	_"github.com/lib/pq"
	"fmt"

)
func failOnError(err error, msg string) {
  if err != nil {
    log.Panicf("%s: %s", msg, err)
  }
}

const (
    host     = "localhost"
    port     = 5432           
    user     = "postgres"
    password = " "
    dbname   = "assign_2"
)

/////////////////////C
func create_(db *sql.DB,name string,roll int) error  {
	insertStmt := `INSERT INTO "Students"("Name", "Roll") VALUES ($1, $2)`
_, err := db.Exec(insertStmt, name, roll)
   if(err!=nil){
	fmt.Print(err)
   }
   return err
}

/////////////////////U
func updateStudent(db *sql.DB, roll int, newName string) error {
	updateStmt := `UPDATE "Students" SET "Name" = $1 WHERE "Roll" = $2`
	_, err := db.Exec(updateStmt, newName, roll)
	if err != nil {
		fmt.Println("Update error:", err)
	}
	return err
}

/////////////////////R
func readStudent(db *sql.DB, roll int) (string, error) {
	query := `SELECT "Name" FROM "Students" WHERE "Roll" = $1`
	var name string
	err := db.QueryRow(query, roll).Scan(&name)
	if err != nil {
		fmt.Println("Read error:", err)
		return "", err
	}
	return name, nil
}

/////////////////////D
func deleteStudent(db *sql.DB, roll int) error {
	deleteStmt := `DELETE FROM "Students" WHERE "Roll" = $1`
	_, err := db.Exec(deleteStmt, roll)
	if err != nil {
		fmt.Println("Delete error:", err)
	}
	return err
}

func sender(data string){
  conn, err := amqp091.Dial("amqp://guest:guest@localhost:5672/")
  failOnError(err, "Failed to connect to RabbitMQ")
  defer conn.Close()
  ch, err := conn.Channel()
failOnError(err, "Failed to open a channel")
defer ch.Close()
q, err := ch.QueueDeclare(
  "hello", // name
  false,   // durable
  false,   // delete when unused
  false,   // exclusive
  false,   // no-wait
  nil,     // arguments
)
failOnError(err, "Failed to declare a queue")
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

body := data
err = ch.PublishWithContext(ctx,
  "",     // exchange
  q.Name, // routing key
  false,  // mandatory
  false,  // immediate
  amqp091.Publishing {
    ContentType: "text/plain",
    Body:        []byte(body),
  })
failOnError(err, "Failed to publish a message")
log.Printf(" [x] Sent %s\n", body)
}
func main()  {
	 psqlconn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
        host, port, user, password, dbname)

  
    db, err := sql.Open("postgres", psqlconn)
    if err != nil {
        log.Fatal("Error opening DB:", err)
    }

  
    if err := db.Ping(); err != nil {
        log.Fatal("Cannot connect to DB:", err)
    }
    defer db.Close()

    fmt.Println("Connected to DB!")

    router := gin.Default()

  
    router.POST("/add", func(c *gin.Context) {
        var student struct {
            Name string `json:"name"`
            Roll int    `json:"roll"`
        }

       
        if err := c.BindJSON(&student); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
            return
        }

        err := create_(db, student.Name, student.Roll)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not insert"})
            return
        }

		sender("Student added successfully!")
        c.JSON(http.StatusOK, gin.H{"message": "Student added successfully!"})
    })

 router.POST("/update", func(c *gin.Context) {
        var student struct {
            Name string `json:"name"`
            Roll int    `json:"roll"`
        }

       
        if err := c.BindJSON(&student); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
            return
        }

        err := updateStudent(db,student.Roll, student.Name)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update"})
            return
        }
       sender("Student updated successfully!")
        c.JSON(http.StatusOK, gin.H{"message": "Student updated successfully!"})
    })

 router.POST("/read", func(c *gin.Context) {
        var student struct {
           
            Roll int    `json:"roll"`
        }

       
        if err := c.BindJSON(&student); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
            return
        }

        stu,err := readStudent(db,student.Roll)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update"})
            return
        }

		sender(stu)
        c.JSON(http.StatusOK, gin.H{"message": stu})
    })


router.POST("/delete", func(c *gin.Context) {
        var student struct {
          
            Roll int    `json:"roll"`
        }

       
        if err := c.BindJSON(&student); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
            return
        }

        err := deleteStudent(db,student.Roll)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete"})
            return
        }
 sender("Student deleted successfully!")
        c.JSON(http.StatusOK, gin.H{"message": "Student deleted successfully!"})
    })









	
	router.Run("localhost:8080")
}