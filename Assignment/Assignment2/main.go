package main

import (
	"compass/backend/controllers"
	"compass/backend/database"
	"compass/backend/models"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err:=godotenv.Load()
	if err!=nil{
		log.Fatal("Error loading .env file")
	}
	hostName:=os.Getenv("HOST_NAME")
	dbUserName:=os.Getenv("USER_NAME")
	dbUserPassword:=os.Getenv("USER_PASSWORD")
	dbName:=os.Getenv("DB_NAME")
	sslMode:=os.Getenv("SSL_MODE")
	listeningPort:=os.Getenv("PORT")

	r := gin.Default()

	db:=database.ConnectToDB(hostName,dbUserName,dbUserPassword,dbName,sslMode)

	db.AutoMigrate(&models.Notice{})
	r.POST("/api/createNotice",controllers.AddNotice(db))
	r.DELETE("/api/deleteNotice/:id",controllers.DeleteNotice(db))
	r.PATCH("/api/updateNotice/:id",controllers.UpdateNotice(db))
	r.GET("/api/readNotice/:id",controllers.ReadNotice(db))
	r.Run(listeningPort)
}
