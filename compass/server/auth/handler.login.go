// package auth

// import "github.com/gin-gonic/gin"

// func loginHandler(c *gin.Context) {
// 	// define the login request model in the request model as per need

// 	// Verify the password hash with the provided password

// 	// on verification create a valid jwt token having the role of the user, (admin, user)
// 	// using the middleware token function, you are required to write the token generator and verifier code

// 	// Save the token in cookie

// 	// Handle all the edge cases with suitable return http code, write them in the read me for later documentation


// }

package auth

import (
	"net/http"
	"time"
    "compass/connections"
	"compass/model"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"strconv"  // Add this import
)



// User represents the user model in database
type User struct {
	ID       uint   `gorm:"primaryKey"`
	Email    string `gorm:"unique"`
	Password string
	Role     string // "admin" or "user"
}

// JWTClaims custom claims structure
type JWTClaims struct {
	UserID uint   `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// AuthConfig holds authentication configuration
type AuthConfig struct {
	JWTSecretKey      string
	TokenExpiration   time.Duration
	CookieDomain      string
	CookieSecure      bool
	CookieHTTPOnly    bool
	SameSiteMode      http.SameSite
}

var authConfig = AuthConfig{
	JWTSecretKey:      "my-256-bit-secret", // Replace with env variable
	TokenExpiration:   24 * time.Hour,
	CookieDomain:      "yourdomain.com",
	CookieSecure:      true,  // Set to false in development
	CookieHTTPOnly:    true,  // Prevent XSS
	SameSiteMode:      http.SameSiteLaxMode,
}

func LoginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// 1. Fetch user from database using connections.DB
	var user model.User
	result := connections.DB.Where("email = ?", req.Email).First(&user)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	// 2. Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := generateJWTToken(user.ID, string(user.Role))  // Convert Role to string
if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
    return
}

	// 4. Set cookie
	setAuthCookie(c, token)

	// 5. Return success response
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user": gin.H{
			"id":    user.ID,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}


func generateJWTToken(userID uint, role string) (string, error) {
    claims := JWTClaims{
        UserID: userID,
        Role:   role,
        RegisteredClaims: jwt.RegisteredClaims{
            Subject:   strconv.FormatUint(uint64(userID), 10), // Fixed missing parenthesis
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(authConfig.TokenExpiration)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
            Issuer:    "campus-compass",
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(authConfig.JWTSecretKey))
}
func setAuthCookie(c *gin.Context, token string) {
	c.SetSameSite(authConfig.SameSiteMode)
	c.SetCookie(
		"auth_token",
		token,
		int(authConfig.TokenExpiration.Seconds()),
		"/",
		authConfig.CookieDomain,
		authConfig.CookieSecure,
		authConfig.CookieHTTPOnly,
	)
}

// Middleware for JWT verification
func AuthMiddleware(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("auth_token")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(authConfig.JWTSecretKey), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		claims, ok := token.Claims.(*JWTClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		// Role-based access control
		if requiredRole != "" && claims.Role != requiredRole {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
			return
		}

		// Add user info to context
		c.Set("userID", claims.UserID)
		c.Set("userRole", claims.Role)
		c.Next()
	}
}