// Entry point of the application
package main

import (
	"campus-compass/backend/auth"
	"campus-compass/backend/config"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"campus-compass/backend/profile"
	"time"
)

func main() {
	// Initialize configuration
	config.InitDB()
	defer config.DB.Close()

	// Setup Gin
	r := gin.Default()

	// CORS Middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Your Next.js URL
		AllowMethods:     []string{"GET", "POST"},
	    AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Setup routes
	auth.SetupRoutes(r)
	// Setup routes
	profile.SetupRoutes(r) // Add this line

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server running on :%s", port)
	log.Fatal(r.Run(":" + port))
}