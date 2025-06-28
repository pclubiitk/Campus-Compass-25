package controllers

import (
	"compass/backend/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddNotice(db *gorm.DB) func(c *gin.Context) {
	return (func(c *gin.Context) {
		var notice models.Notice


		if err := c.ShouldBindJSON(&notice); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request body",
				"details": err.Error(),
			})
			return
		}

		isCreated:=db.Create(&notice)
		if isCreated.Error!=nil{
			fmt.Println("Error creating notice",isCreated.Error)
			c.JSON(500,gin.H{"message":"Error creating notice","error":isCreated.Error})
			return
		}else {
			c.JSON(http.StatusCreated,gin.H{"message":"new notice created","notice":notice})
		}

	})
}

func DeleteNotice(db *gorm.DB) func(c *gin.Context) {
	return (func(c *gin.Context) {
		id := c.Param("id") // Expecting route like "/notices/:id"

		result := db.Delete(&models.Notice{}, "id = ?", id)

		if result.Error != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
            return
        }

        if result.RowsAffected == 0 {
            c.JSON(http.StatusNotFound, gin.H{"error": "No notice found with that ID"})
            return
        }

        c.JSON(http.StatusOK, gin.H{"message": "Notice deleted successfully"})
	})
}

func UpdateNotice(db *gorm.DB) func(c *gin.Context) {
	return (func(c *gin.Context) {
		id := c.Param("id")

		// 2. Bind update data
		var updateData models.UpdateNoticeRequest
		if err := c.ShouldBindJSON(&updateData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		// 3. Find existing notice
		var notice models.Notice
		if err := db.First(&notice, "id = ?", id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Notice not found"})
			return
		}

		// 4. Apply partial updates
		if updateData.CardTitle != nil {
			notice.CardTitle = *updateData.CardTitle
		}
		if updateData.CardDescription != nil {
			notice.CardDescription = *updateData.CardDescription
		}
		if updateData.NoticePreview != nil {
			notice.NoticePreview = *updateData.NoticePreview
		}
		if updateData.Description != nil {
			notice.Description = *updateData.Description
		}

		if err := db.Save(&notice).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update notice"})
			return
		}

		c.JSON(http.StatusOK, notice)
	})
}

func ReadNotice(db *gorm.DB) func(c *gin.Context) {
	return (func(c *gin.Context) {
		id := c.Param("id")

		var notice models.Notice
		if err := db.First(&notice, "id = ?", id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Notice not found"})
			return
		}

		c.JSON(http.StatusOK, notice);
	})
}