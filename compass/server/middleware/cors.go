package middleware

import "github.com/gin-gonic/gin"

// Manage all cors settings here

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")      // Get the request origin
		if origin != "" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin) // Echo back the origin
			c.Writer.Header().Set("Vary", "Origin") // Important for caching (so browsers don’t cache wildcard)
		}
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true") // Allow cookies
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		// Handle preflight OPTIONS request
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204) // Respond with 204 No Content
			return
		}

		c.Next() // Let the request continue to the next middleware or route
	}
}
