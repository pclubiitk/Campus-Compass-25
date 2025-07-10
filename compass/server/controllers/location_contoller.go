package controllers

import (
"compass/model"
	"gorm.io/gorm"
	"strconv"
	"github.com/gin-gonic/gin"
	"net/http"
)


func SearchLocations(c *gin.Context) {
    db := c.MustGet("db").(*gorm.DB)
    
    // Get query params
    query := c.Query("query")
    thresholdStr := c.DefaultQuery("threshold", "0.3")
    
    threshold, err := strconv.ParseFloat(thresholdStr, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid threshold"})
        return
    }

    var results []model.LocationSearchResult
    
    err = db.Raw(`
    SELECT locations.*, similarity(name, ?) as similarity
    FROM locations
    WHERE similarity(name, ?) >= ?
    AND status = 'approved'
    ORDER BY similarity DESC
    LIMIT 10
`, query, query, threshold).Scan(&results).Error
    
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "search failed"})
        return
    }
    
    c.JSON(http.StatusOK, results)
}