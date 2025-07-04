package profile

import (
	"compass/config"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type ProfileResponse struct {
	User struct {
		Email        string `json:"email"`
		ProfileImage string `json:"profile_image"`
	} `json:"user"`
	Contributions []struct {
		Review       string  `json:"review"`
		Rating       float64 `json:"rating"`
		ImageURLs    []string `json:"image_urls"`
		SpotID       int     `json:"spot_id"`
		SpotName     string  `json:"spot_name"`
		LocationType string  `json:"location_type"`
	} `json:"contributions,omitempty"`
	FavoriteSpots []struct {
		Description  string  `json:"description"`
		Rating       float64 `json:"rating"`
		ImageURLs    []string `json:"image_urls"`
		LocationType string  `json:"location_type"`
	} `json:"favorite_spots,omitempty"`
}

func GetProfileHandler(c *gin.Context) {
	claims, exists := c.Get("claims")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userID := claims.(jwt.MapClaims)["sub"].(string)

	var user struct {
		Email        string
		ProfileImage string
	}
	err := config.DB.QueryRow(
		"SELECT email, profile_image FROM users WHERE id = $1", 
		userID,
	).Scan(&user.Email, &user.ProfileImage)

	if err != nil {
		handleDatabaseError(c, err)
		return
	}

	response := buildProfileResponse(userID, user)
	c.JSON(http.StatusOK, response)
}

func GetProfileByIDHandler(c *gin.Context) {
	profileID := c.Param("id")
	claims, _ := c.Get("claims")
	_ = claims.(jwt.MapClaims)["sub"].(string) // requestingUserID
	
	var user struct {
		Email        string
		ProfileImage string
	}
	err := config.DB.QueryRow(
		"SELECT email, profile_image FROM users WHERE id = $1", 
		profileID,
	).Scan(&user.Email, &user.ProfileImage)

	if err != nil {
		handleDatabaseError(c, err)
		return
	}

	response := buildProfileResponse(profileID, user)
	c.JSON(http.StatusOK, response)
}

func handleDatabaseError(c *gin.Context, err error) {
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
	} else {
		log.Printf("Database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
	}
}

func buildProfileResponse(userID string, user struct {
	Email        string
	ProfileImage string
}) ProfileResponse {
	response := ProfileResponse{}
	response.User.Email = user.Email
	response.User.ProfileImage = user.ProfileImage

	response.Contributions = getContributions(userID)
	response.FavoriteSpots = getFavoriteSpots(userID)

	return response
}


func getContributions(userID string) []struct {
	Review       string  `json:"review"`
	Rating       float64 `json:"rating"`
	ImageURLs    []string `json:"image_urls"`
	SpotID       int     `json:"spot_id"`
	SpotName     string  `json:"spot_name"`
	LocationType string  `json:"location_type"`
} {
	rows, err := config.DB.Query(`
		SELECT c.review, c.rating, c.spot_id, s.description, l.location_type
		FROM contributions c
		LEFT JOIN spots s ON c.spot_id = s.spot_id
		LEFT JOIN location l ON s.spot_id = l.id
		WHERE c.user_id = $1`,
		userID,
	)
	if err != nil {
		log.Printf("Contributions query error: %v", err)
		return nil
	}
	defer rows.Close()

	var contributions []struct {
		Review       string  `json:"review"`
		Rating       float64 `json:"rating"`
		ImageURLs    []string `json:"image_urls"`
		SpotID       int     `json:"spot_id"`
		SpotName     string  `json:"spot_name"`
		LocationType string  `json:"location_type"`
	}

	for rows.Next() {
		var c struct {
			Review       string
			Rating       float64
			SpotID       int
			SpotDesc     sql.NullString
			LocationType sql.NullString
		}

		err := rows.Scan(
			&c.Review,
			&c.Rating,
			&c.SpotID,
			&c.SpotDesc,
			&c.LocationType,
		)
		if err != nil {
			log.Printf("Error scanning contribution: %v", err)
			continue
		}

		// Fetch image URLs for this spot_id
		imageURLs := getImageURLsForSpot(c.SpotID)

		contributions = append(contributions, struct {
			Review       string  `json:"review"`
			Rating       float64 `json:"rating"`
			ImageURLs    []string `json:"image_urls"`
			SpotID       int     `json:"spot_id"`
			SpotName     string  `json:"spot_name"`
			LocationType string  `json:"location_type"`
		}{
			Review:       c.Review,
			Rating:       c.Rating,
			ImageURLs:    imageURLs,
			SpotID:       c.SpotID,
			SpotName:     c.SpotDesc.String,
			LocationType: c.LocationType.String,
		})
	}

	return contributions
}

func getFavoriteSpots(userID string) []struct {
	Description  string  `json:"description"`
	Rating       float64 `json:"rating"`
	ImageURLs    []string `json:"image_urls"`
	LocationType string  `json:"location_type"`
} {
	rows, err := config.DB.Query(`
		SELECT s.spot_id, s.description, s.rating, l.location_type
		FROM spots s
		LEFT JOIN location l ON s.spot_id = l.id
		WHERE s.user_id = $1`,
		userID,
	)
	if err != nil {
		log.Printf("Favorite spots query error: %v", err)
		return nil
	}
	defer rows.Close()

	var spots []struct {
		Description  string  `json:"description"`
		Rating       float64 `json:"rating"`
		ImageURLs    []string `json:"image_urls"`
		LocationType string  `json:"location_type"`
	}

	for rows.Next() {
		var s struct {
			SpotID       int
			Description  string
			Rating       float64
			LocationType sql.NullString
		}

		err := rows.Scan(
			&s.SpotID,
			&s.Description,
			&s.Rating,
			&s.LocationType,
		)
		if err != nil {
			log.Printf("Error scanning favorite spot: %v", err)
			continue
		}

		imageURLs := getImageURLsForSpot(s.SpotID)

		spots = append(spots, struct {
			Description  string  `json:"description"`
			Rating       float64 `json:"rating"`
			ImageURLs    []string `json:"image_urls"`
			LocationType string  `json:"location_type"`
		}{
			Description:  s.Description,
			Rating:       s.Rating,
			ImageURLs:    imageURLs,
			LocationType: s.LocationType.String,
		})
	}

	return spots
}


func getImageURLsForSpot(spotID int) []string {
	rows, err := config.DB.Query(
		"SELECT url FROM image WHERE spot_id = $1",
		spotID,
	)
	if err != nil {
		log.Printf("Image URLs query error for spot %d: %v", spotID, err)
		return nil
	}
	defer rows.Close()

	var urls []string
	for rows.Next() {
		var url sql.NullString
		if err := rows.Scan(&url); err != nil {
			log.Printf("Error scanning image URL: %v", err)
			continue
		}
		if url.Valid {
			urls = append(urls, url.String)
		}
	}

	return urls
}
