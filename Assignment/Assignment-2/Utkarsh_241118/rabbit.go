package main

import (
    "log"
    "os"

    "github.com/streadway/amqp"
)

var rabbitConn *amqp.Connection
var rabbitChannel *amqp.Channel
var rabbitQueue amqp.Queue

func InitRabbitMQ() {
    var err error

    url := os.Getenv("RABBITMQ_URL")
    if url == "" {
        url = "amqp://guest:guest@localhost:5672/"
    }

    rabbitConn, err = amqp.Dial(url)
    if err != nil {
        log.Fatalf("Failed to connect to RabbitMQ: %v", err)
    }

    rabbitChannel, err = rabbitConn.Channel()
    if err != nil {
        log.Fatalf("Failed to open RabbitMQ channel: %v", err)
    }

    rabbitQueue, err = rabbitChannel.QueueDeclare(
        "student_queue", // queue name
        true,            // durable
        false,           // delete when unused
        false,           // exclusive
        false,           // no-wait
        nil,             // arguments
    )
    if err != nil {
        log.Fatalf("Failed to declare RabbitMQ queue: %v", err)
    }

    log.Println("✅ Connected to RabbitMQ and queue declared")
}

func PublishToQueue(message string) error {
    return rabbitChannel.Publish(
        "",               // exchange
        rabbitQueue.Name, // routing key (queue name)
        false,            // mandatory
        false,            // immediate
        amqp.Publishing{
            ContentType: "text/plain",
            Body:        []byte(message),
        },
    )
}

func StartConsumer() {
    msgs, err := rabbitChannel.Consume(
        rabbitQueue.Name, // queue
        "",               // consumer
        true,             // auto-ack
        false,            // exclusive
        false,            // no-local
        false,            // no-wait
        nil,              // args
    )
    if err != nil {
        log.Fatalf("Failed to register RabbitMQ consumer: %v", err)
    }

    go func() {
        for d := range msgs {
            log.Printf("📩 Received from queue: %s", d.Body)
        }
    }()

    log.Println("Consumer started, waiting for messages...")
}
