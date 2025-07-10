//mytask done

package maps

import (
	"compass/connections"
	"compass/model"
	"fmt"
	"net/http"
	"strconv"
	"github.com/spf13/viper"
	"github.com/gin-gonic/gin"
	"github.com/microcosm-cc/bluemonday"
	"github.com/sirupsen/logrus"
)

func noticeProvider(c *gin.Context) {
	pageSize := 10

	// Get page number from path param
	pageStr := c.Query("page")
	start := c.Query("start")
	end := c.Query("end")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		// If conversion fails or page is less than 1
		c.JSON(400, gin.H{"error": "Invalid page number"})
		return
	}

	offset := (page - 1) * pageSize
	var noticeList []model.Notice

	// Fetch from DB with limit and offset
	result := connections.DB.
		Where("created_at BETWEEN ? AND ?", start, end).
		Order("created_at DESC").
		Limit(pageSize).
		Offset(offset).
		Find(&noticeList)

	var count int64
	if err := connections.DB.Model(&model.Notice{}).Count(&count).Error; err != nil {
		// handle error
		fmt.Println("Error counting users:", err)
		return
	}

	p := bluemonday.UGCPolicy() // User-Generated Content policy
	for i := range noticeList {
		noticeList[i].Description = p.Sanitize(noticeList[i].Description)
	}



	// Check DB error
	if result.Error != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch notices"})
		return
	}

	// Return the result
	c.JSON(200, gin.H{
		"page":             page,
		"page_size":        pageSize,
		"noticeboard_list": noticeList,
		"total": 			count,
	})
}

func noticeProviderv2(c *gin.Context) {
	pageStr := c.Query("page")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or missing 'page' query parameter"})
		return
	}

	//It Loads noticesPerPage 
	noticesPerPage := viper.GetInt("pagination.noticesPerPage")
	if noticesPerPage <= 0 {
		noticesPerPage = 10
		logrus.Println("Warning: 'noticesPerPage' not set or invalid. Using default = 10")
	}

	offset := (page - 1) * noticesPerPage
	var notices []model.Notice

	query := connections.DB.Model(&model.Notice{})

	var total int64
	if err := query.Count(&total).Error; err != nil {
		logrus.Printf("Failed to count notices: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database count error"})
		return
	}

	result := query.
		Preload("User").
		Order("created_at DESC").
		Limit(noticesPerPage).
		Offset(offset).
		Find(&notices)

	if result.Error != nil {
		logrus.Printf("Failed to fetch notices: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query failed"})
		return
	}

	//This is for XSS protection
	p := bluemonday.UGCPolicy()
	for i := range notices {
		notices[i].Description = p.Sanitize(notices[i].Description)
	}

	c.JSON(http.StatusOK, gin.H{
		"currentPage": page,
		"noticesPerPage": noticesPerPage,
		"totalNotices": total,
		"data": notices,
	})
	
}


func locationProvider(c *gin.Context) {
	// Details in router.go
	var locations []model.Location

	err := connections.DB.
		Model(&model.Location{}).
		Where("status = ?", "approved").
		Select("location_id", "name", "latitude", "longitude").
		Find(&locations).Error

	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch locations"})
		return
	}

	c.JSON(200, gin.H{"locations": locations})
	// Handle all the edge cases with suitable return http code, write them in the read me for later documentation

}

func locationDetailProvider(c *gin.Context) {
	// Details in router.go
	id := c.Param("id")

	var loc model.Location
	err := connections.DB.
		Model(&model.Location{}).
		Where("location_id = ? AND status = ?", id, "approved").
		First(&loc).Error

	if err != nil {
		c.JSON(404, gin.H{"error": "Location not found"})
		return
	}

	c.JSON(200, gin.H{"location": loc})
	// Handle all the edge cases with suitable return http code, write them in the read me for later documentation

}
func cacheLocationProvider(c *gin.Context) {
	startStr := c.Query("start")
	endStr := c.Query("end")

	start, err1 := strconv.Atoi(startStr)
	end, err2 := strconv.Atoi(endStr)

	if err1 != nil || err2 != nil || start < 1 || end < start {
		c.JSON(400, gin.H{"error": "Invalid start or end"})
		return
	}

	limit := end - start + 1
	offset := start - 1

	var locations []model.Location
	err := connections.DB.
		Model(&model.Location{}).
		Where("status = ?", "approved").
		Offset(offset).
		Limit(limit).
		Find(&locations).Error

	if err != nil {
		c.JSON(400, gin.H{"error": "Failed to fetch locations"})
		return
	}

	c.JSON(200, locations)
}


func reviewProvider(c *gin.Context) {
	locationID := c.Param("id")
	if locationID == "" {
		c.JSON(400, gin.H{"error": "location_id is required"})
		return
	}

	page := 1
	limit := 50
	if p := c.Query("page"); p != "" {
		if parsedPage, err := strconv.Atoi(p); err != nil || parsedPage < 1 {
			c.JSON(400, gin.H{"error": "invalid page parameter"})
			return
		} else {
			page = parsedPage
		}
	}

	offset := (page - 1) * limit

	reviews, total, err := fetchReviewsByLocationID(locationID, limit, offset)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch reviews"})
		return
	}

	// hasMore := offset+len(reviews) < total

	c.JSON(200, gin.H{
		"reviews": reviews,
		"page":    page,
		"total":   total,
	})
}

func fetchReviewsByLocationID(locationID string, limit, offset int) ([]model.Review, int, error) {
	var reviews []model.Review
	var total int64
	db := connections.DB

	if err := db.Model(&model.Review{}).Where("location_id = ?", locationID).Where("status = ?", "approved").Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := db.Where("location_id = ?", locationID).
	Where("status = ?", "approved").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error; err != nil {
		return nil, 0, err
	}

	return reviews, int(total), nil
}
