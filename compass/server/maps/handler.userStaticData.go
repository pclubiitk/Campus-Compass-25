//mytask done

package maps

import (
	"compass/connections"
	"compass/model"
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/microcosm-cc/bluemonday"
)
func noticeProvider(c *gin.Context) {
	pageSize := 10
	pageStr := c.Query("page")
	start := c.Query("start")
	end := c.Query("end")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		c.JSON(400, gin.H{"error": "Invalid page number"})
		return
	}
	offset := (page - 1) * pageSize
	var noticeList []model.Notice

	query := connections.DB.Preload("User").Model(&model.Notice{})

	if start != "" && end != "" {
		query = query.Where("created_at BETWEEN ? AND ?", start, end)
	}

	result := query.
		Order("created_at DESC").
		Limit(pageSize).
		Offset(offset).
		Find(&noticeList)

	if result.Error != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch notices"})
		return
	}

	var count int64
	countQuery := connections.DB.Model(&model.Notice{})
	if start != "" && end != "" {
		countQuery = countQuery.Where("created_at BETWEEN ? AND ?", start, end)
	}
	if err := countQuery.Count(&count).Error; err != nil {
		fmt.Println("Error counting notices:", err)
		return
	}

	p := bluemonday.UGCPolicy()
	for i := range noticeList {
		noticeList[i].Description = p.Sanitize(noticeList[i].Description)
	}

	fmt.Println(noticeList)

	c.JSON(200, gin.H{
		"page":             page,
		"page_size":        pageSize,
		"noticeboard_list": noticeList,
		"total":            count,
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

func reviewProvider(c *gin.Context) {
	locationID := c.Query("location_id")
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

	if err := db.Model(&model.Review{}).Where("location_id = ?", locationID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := db.Where("location_id = ?", locationID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error; err != nil {
		return nil, 0, err
	}

	return reviews, int(total), nil
}
