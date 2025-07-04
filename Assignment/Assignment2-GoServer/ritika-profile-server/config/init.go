// // Central place to call all other config inits (viper, logging etc.)
// // package config

// // func Init() {
// // 	// Initialize Viper configuration
// // 	// Initialize logging
// // 	// Initialize Redis connection
// // 	// Initialize other services or configurations as needed

package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
	"github.com/joho/godotenv"
)

var DB *sql.DB

func InitDB() {
	// Load .env file
	err := godotenv.Load("../.env") // Adjust path if needed
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	var errDB error
	DB, errDB = sql.Open("postgres", connStr)
	if errDB != nil {
		log.Fatal("Database connection failed:", errDB)
	}

	errPing := DB.Ping()
	if errPing != nil {
		log.Fatal("Database ping failed:", errPing)
	}

	log.Println("Connected to PostgreSQL!")
}