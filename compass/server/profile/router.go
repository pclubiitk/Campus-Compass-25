package profile

import (
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"github.com/golang-jwt/jwt/v5"
	"strings" // Add this import
	"fmt"
)

func SetupRoutes(r *gin.Engine) {
	// Configure auth middleware with Viper
	authMiddleware := AuthMiddleware(viper.GetString("jwt.secret_key"))
	
	profileGroup := r.Group("/api/profile")
	profileGroup.Use(authMiddleware)
	
	profileGroup.GET("/", GetProfileHandler)
	profileGroup.GET("/:id", GetProfileByIDHandler)
	
	logrus.WithFields(logrus.Fields{
		"routes": []string{"/api/profile", "/api/profile/:id"},
	}).Info("Profile routes initialized")
}

func AuthMiddleware(secretKey string) gin.HandlerFunc {
	return func(c *gin.Context) {
		logger := logrus.WithFields(logrus.Fields{
			"middleware": "auth",
			"path":      c.Request.URL.Path,
		})
		
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			logger.Warn("Missing authorization header")
			c.JSON(401, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		parts := strings.Split(tokenString, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			logger.Warn("Invalid authorization header format")
			c.JSON(401, gin.H{"error": "Invalid Authorization header format"})
			c.Abort()
			return
		}

		token, err := jwt.Parse(parts[1], func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				logger.WithField("alg", token.Header["alg"]).Warn("Unexpected signing method")
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(secretKey), nil
		})

		if err != nil {
			logger.WithError(err).Warn("Token validation failed")
			c.JSON(401, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			c.Set("claims", claims)
			logger.WithField("user_id", claims["sub"]).Debug("User authenticated")
		} else {
			logger.Warn("Invalid token claims")
			c.JSON(401, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		c.Next()
	}
}