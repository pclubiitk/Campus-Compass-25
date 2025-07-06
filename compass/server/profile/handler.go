package profile

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"
	
	"compass/auth"
	"compass/connections"
	"compass/model"
	"github.com/gin-gonic/gin"
	
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)



func GetProfileHandler(c *gin.Context) {
	logger := logrus.WithFields(logrus.Fields{
		"handler": "GetProfileHandler",
		"time":    time.Now().UTC(),
	})

	claims, exists := c.Get("claims")
	if !exists {
		logger.Warn("Unauthorized access attempt - no claims in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	jwtClaims, ok := claims.(*auth.JWTClaims)
	if !ok {
		logger.Warn("Invalid claims type in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	userID := jwtClaims.UserID
	logger = logger.WithField("user_id", userID)

	var user model.User
	if err := connections.DB.First(&user, "id = ?", userID).Error; err != nil {
		logger.WithError(err).Error("Failed to fetch user profile")
		handleDatabaseError(c, err)
		return
	}

	response := ProfileResponse{
		User: struct {
			Email        string `json:"email"`
			ProfileImage string `json:"profile_image"`
		}{
			Email: user.Email,
		},
	}

	userIDStr := strconv.FormatUint(uint64(userID), 10)
	contributions, err := getContributions(userIDStr)
	if err != nil {
		logger.WithError(err).Warn("Failed to fetch contributions")
	} else {
		response.Contributions = contributions
	}

	favoriteSpots, err := getFavoriteSpots(userIDStr)
	if err != nil {
		logger.WithError(err).Warn("Failed to fetch favorite spots")
	} else {
		response.FavoriteSpots = favoriteSpots
	}

	logger.WithFields(logrus.Fields{
		"contributions_count": len(response.Contributions),
		"favorite_spots_count": len(response.FavoriteSpots),
	}).Info("Profile data fetched successfully")

	c.JSON(http.StatusOK, response)
}

func GetProfileByIDHandler(c *gin.Context) {
	logger := logrus.WithFields(logrus.Fields{
		"handler":    "GetProfileByIDHandler",
		"profile_id": c.Param("id"),
		"time":       time.Now().UTC(),
	})

	profileID := c.Param("id")
	claims, exists := c.Get("claims")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	jwtClaims, ok := claims.(*auth.JWTClaims)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	requestingUserID := strconv.FormatUint(uint64(jwtClaims.UserID), 10)
	requestingUserRole := jwtClaims.Role

	logger = logger.WithFields(logrus.Fields{
		"requesting_user_id":   requestingUserID,
		"requesting_user_role": requestingUserRole,
	})

	if requestingUserID != profileID && requestingUserRole != "admin" {
		logger.Warn("Unauthorized profile access attempt")
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	var user model.User
	if err := connections.DB.First(&user, "id = ?", profileID).Error; err != nil {
		logger.WithError(err).Error("Failed to fetch user profile")
		handleDatabaseError(c, err)
		return
	}

	response := ProfileResponse{
		User: struct {
			Email        string `json:"email"`
			ProfileImage string `json:"profile_image"`
		}{
			Email: user.Email,
		},
	}

	if requestingUserID == profileID || requestingUserRole == "admin" {
		contributions, err := getContributions(profileID)
		if err != nil {
			logger.WithError(err).Warn("Failed to fetch contributions")
		} else {
			response.Contributions = contributions
		}

		favoriteSpots, err := getFavoriteSpots(profileID)
		if err != nil {
			logger.WithError(err).Warn("Failed to fetch favorite spots")
		} else {
			response.FavoriteSpots = favoriteSpots
		}
	}

	logger.Info("Profile data fetched successfully")
	c.JSON(http.StatusOK, response)
}

func handleDatabaseError(c *gin.Context, err error) {
	logger := logrus.WithFields(logrus.Fields{
		"handler": "handleDatabaseError",
		"error":   err.Error(),
	})

	if err == gorm.ErrRecordNotFound {
		logger.Warn("User not found")
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
	} else {
		logger.Error("Database error occurred")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
	}
}

func getContributions(userID string) ([]Contribution, error) {
	logger := logrus.WithFields(logrus.Fields{
		"function": "getContributions",
		"user_id":  userID,
	})

	var contributions []struct {
		Review       string
		Rating       float64
		SpotID       int
		SpotName     sql.NullString
		LocationType sql.NullString
	}

	result := connections.DB.Raw(`
		SELECT c.review, c.rating, c.spot_id, s.name as spot_name, l.type as location_type
		FROM contributions c
		JOIN spots s ON c.spot_id = s.id
		JOIN locations l ON s.location_id = l.id
		WHERE c.user_id = ?`, userID).Scan(&contributions)

	if result.Error != nil {
		logger.WithError(result.Error).Error("Failed to query contributions")
		return nil, result.Error
	}

	var response []Contribution
	for _, c := range contributions {
		imageURLs, err := getImageURLsForSpot(c.SpotID)
		if err != nil {
			logger.WithError(err).Warnf("Failed to get images for spot %d", c.SpotID)
		}

		response = append(response, Contribution{
			Review:       c.Review,
			Rating:       c.Rating,
			ImageURLs:    imageURLs,
			SpotID:       c.SpotID,
			SpotName:     c.SpotName.String,
			LocationType: c.LocationType.String,
		})
	}

	logger.Debugf("Found %d contributions", len(response))
	return response, nil
}

func getFavoriteSpots(userID string) ([]FavoriteSpot, error) {
	logger := logrus.WithFields(logrus.Fields{
		"function": "getFavoriteSpots",
		"user_id":  userID,
	})

	var spots []struct {
		Description  string
		Rating       float64
		SpotID       int
		LocationType sql.NullString
	}

	result := connections.DB.Raw(`
		SELECT s.description, s.rating, s.id as spot_id, l.type as location_type
		FROM favorite_spots fs
		JOIN spots s ON fs.spot_id = s.id
		JOIN locations l ON s.location_id = l.id
		WHERE fs.user_id = ?`, userID).Scan(&spots)

	if result.Error != nil {
		logger.WithError(result.Error).Error("Failed to query favorite spots")
		return nil, result.Error
	}

	var response []FavoriteSpot
	for _, s := range spots {
		imageURLs, err := getImageURLsForSpot(s.SpotID)
		if err != nil {
			logger.WithError(err).Warnf("Failed to get images for spot %d", s.SpotID)
		}

		response = append(response, FavoriteSpot{
			Description:  s.Description,
			Rating:       s.Rating,
			ImageURLs:    imageURLs,
			LocationType: s.LocationType.String,
		})
	}

	logger.Debugf("Found %d favorite spots", len(response))
	return response, nil
}

func getImageURLsForSpot(spotID int) ([]string, error) {
	logger := logrus.WithFields(logrus.Fields{
		"function": "getImageURLsForSpot",
		"spot_id":  spotID,
	})

	var urls []string
	result := connections.DB.Raw(`
		SELECT url FROM spot_images 
		WHERE spot_id = ? 
		ORDER BY display_order`, spotID).Pluck("url", &urls)

	if result.Error != nil {
		logger.WithError(result.Error).Error("Failed to query spot images")
		return nil, result.Error
	}

	logger.Debugf("Found %d images for spot", len(urls))
	return urls, nil
}