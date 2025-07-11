package controllers

import (
	"github.com/gin-gonic/gin"
	
)

func SetupLocationRoutes(router *gin.Engine) {
	locationGroup := router.Group("/api/locations")
	{
		locationGroup.GET("/search", SearchLocations)
	
	}
}