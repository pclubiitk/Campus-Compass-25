package Assignment2_shivanshdeep

import (
	"encoding/json"
	"fmt"
	"github.com/streadway/amqp"
	"log"

	_ "github.com/lib/pq"
	_ "github.com/streadway/amqp"
)

type Location struct {
	ID               int     `json:"id"`
	Latitude         float64 `json:"latitude"`
	Longitude        float64 `json:"longitude"`
	LocationType     string  `json:"location_type"`
	AvgRating        float64 `json:"avg_rating"`
	ReviewCount      int     `json:"review_count"`
	TotalImagesCount int     `json:"total_images_count"`
	Contributor      int     `json:"contributor"`
}

type LocationMessage struct {
	Action string   `json:"action"` // create, update, delete
	Data   Location `json:"data"`
}

// Error Handler
func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func main() {
	//same as the recevier file
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"location_queue", // name
		false,            // durable
		false,            // delete when unused
		false,            // exclusive
		false,            // no-wait
		nil,              // arguments
	)
	failOnError(err, "Failed to declare a queue")

	newLoc := Location{
		Latitude:         26.5,
		Longitude:        80.3,
		LocationType:     "Cafe",
		AvgRating:        4.2,
		ReviewCount:      25,
		TotalImagesCount: 3,
		Contributor:      1,
	}

	body, err := json.Marshal(newLoc) //converts go struct to json
	failOnError(err, "Failed to serialize data")

	err = ch.Publish(
		"data go",
		q.Name, // routing key (queue name)
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body, //sening josned data to Rabbit Queue
		},
	)
	failOnError(err, "Failed to publish a message")

	fmt.Println("📤 Sent message to queue:", string(body)) //confirmation
}
