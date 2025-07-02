package profile

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"strings"
)

func SetupRoutes(r *gin.Engine) {
	// Protected profile routes
	profileGroup := r.Group("/api/profile")
	profileGroup.Use(AuthMiddleware())
	
	// Current user's profile
	profileGroup.GET("/", GetProfileHandler)
	
	// Specific profile by ID
	profileGroup.GET("/:id", GetProfileByIDHandler)  
}

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 1. Get and validate header
           tokenString := c.GetHeader("Authorization")
        
        // Fallback to query param (for debugging)
        if tokenString == "" {
            tokenString = c.Query("Authorization")
        }
        
        if tokenString == "" {
            c.JSON(401, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        // 2. Split Bearer token
        parts := strings.Split(tokenString, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            c.JSON(401, gin.H{"error": "Invalid Authorization header format"})
            c.Abort()
            return
        }

        // 3. Parse token
        token, err := jwt.Parse(parts[1], func(token *jwt.Token) (interface{}, error) {
            return []byte("your-256-bit-secret"), nil // Use env var in production
        })

        if err != nil || !token.Valid {
            c.JSON(401, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        // 4. Store claims
        c.Set("claims", token.Claims)
        c.Next()
    }
}