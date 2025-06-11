package Assignment2_shivanshdeep

import (
	"database/sql"  //go's DB standard interface
	"encoding/json" //json to go struct conversion
	"errors"
	"fmt"
	"log"

	_ "github.com/lib/pq"       //postgres
	"github.com/streadway/amqp" //rabbit
)

// CRUDs
func createLocation(db *sql.DB, loc Location) int {
	var id int
	query := `
        INSERT INTO locations (latitude, longitude, location_type, avg_rating, review_count, total_images_count, contributor)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
    `
	err := db.QueryRow(query, loc.Latitude, loc.Longitude, loc.LocationType, loc.AvgRating, loc.ReviewCount).Scan(&id)
	if err != nil {
		log.Fatal(err)
	}
	return id
}

func getLocation(db *sql.DB, id int) {
	var loc Location
	query := `SELECT id, latitude, longitude, location_type, avg_rating, review_count, total_images_count, contributor  FROM locations WHERE id = $1`
	row := db.QueryRow(query, id)
	err := row.Scan(&loc.ID, &loc.Latitude, &loc.Longitude, &loc.LocationType, &loc.AvgRating, &loc.ReviewCount)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			fmt.Printf("No location found with ID %d\n", id)
		} else {
			log.Println("Get by ID failed:", err)
		}
		return
	}
	fmt.Printf("Found location: %+v\n", loc)
	//this is void function rn, but can be used to return loc struct as well.
}

func updateLocation(db *sql.DB, loc Location) {
	query := `
        UPDATE locations
        SET latitude = $1, longitude = $2, location_type = $3, avg_rating = $4, review_count = $5, total_images_count = $6, contributor = $7
        WHERE id = $8
    `
	_, err := db.Exec(query, loc.Latitude, loc.Longitude, loc.LocationType, loc.AvgRating, loc.ReviewCount, loc.TotalImagesCount, loc.Contributor, loc.ID)
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Updated Location", loc.ID)
	}
}

func deleteLocation(db *sql.DB, id int) {
	query := `DELETE FROM locations WHERE id = $1`
	_, err := db.Exec(query, id)
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Deleted Location", id)
	}
}

func main() {

	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/") //connecting to Rabbit
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	db, err := sql.Open("postgres", "postgres://postgres:password@localhost:5432/mydb?sslmode=disable") //connecting to postgresql
	failOnError(err, "Postgres connect fail")
	defer db.Close()

	ch, err := conn.Channel() //chaneel for sending and getting data
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare("location_queue", false, false, false, false, nil) //Rabbit queue
	failOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(q.Name, "", true, false, false, false, nil) //eating msgs from queue
	failOnError(err, "Failed to register a consumer")

	fmt.Println("👂 Waiting for messages...")

	forever := make(chan bool)

	go func() {
		//a go routine, runs parallelly
		for d := range msgs {
			var msg LocationMessage
			err := json.Unmarshal(d.Body, &msg) //converts a json string into a go struct
			if err != nil {
				log.Println("Failed to decode message:", err)
				continue
			}

			//neat way to check what sort of query was asked
			switch msg.Action {
			case "create":
				id := createLocation(db, msg.Data)
				fmt.Printf("✅ Created Location ID %d: %+v\n", id, msg.Data)
			case "update":
				updateLocation(db, msg.Data)
			case "delete":
				deleteLocation(db, msg.Data.ID)
			case "get":
				getLocation(db, msg.Data.ID)
			default:
				log.Println("Unknown action:", msg.Action)
			}

		}
	}()

	<-forever
}
