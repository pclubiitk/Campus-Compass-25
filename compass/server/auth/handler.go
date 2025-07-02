package auth

import (
	"campus-compass/backend/config"
	"log"
	// "mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"database/sql"
	"github.com/golang-jwt/jwt/v5"
)

type SignupRequest struct {
	Email    string `form:"email" binding:"required,email"`
	Password string `form:"password" binding:"required,min=6"`
}

func SignupHandler(c *gin.Context) {
	// 1. Parse multipart form (10MB max)
	if err := c.Request.ParseMultipartForm(10 << 20); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to parse form data",
			"details": err.Error(),
		})
		return
	}

	// 2. Validate and bind form data
	var req SignupRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Validation failed",
			"details": err.Error(),
		})
		return
	}

	// 3. Handle file upload
	var photoURL string
	if file, err := c.FormFile("profile_image"); err == nil {
		// Generate secure filename
		ext := filepath.Ext(file.Filename)
		newFilename := uuid.New().String() + ext
		uploadPath := filepath.Join("uploads", newFilename)

		// Create uploads directory if not exists
		if err := os.MkdirAll("uploads", 0755); err != nil {
			log.Printf("Failed to create uploads directory: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to process file upload",
			})
			return
		}

		// Save file
		if err := c.SaveUploadedFile(file, uploadPath); err != nil {
			log.Printf("Failed to save file: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to save file",
			})
			return
		}
		photoURL = "/uploads/" + newFilename
	}

	// 4. Hash password (recommended)
	hashedPassword, err := HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to process password",
		})
		return
	}

	// 5. Insert into database
	query := `
		INSERT INTO users (email, password, profile_image, registration, last_update, is_verified)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`

	var userID string
	err = config.DB.QueryRow(
		query,
		req.Email,
		hashedPassword,
		photoURL,
		time.Now(),
		time.Now(),
		false,
	).Scan(&userID)

	if err != nil {
		log.Printf("Database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create user",
		})
		return
	}


	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"user_id": userID,
		// "token":   token,
	})
}

func HashPassword(password string) (string, error) {
    // Generate bcrypt hash (cost factor 10 is default)
    hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        return "", err
    }
    return string(hashedBytes), nil // ✅ Returns actual hash
}

var jwtSecret = []byte("your-256-bit-secret")

func GenerateJWT(userID string) (string, error) {
	// 1. Define token claims
	claims := jwt.MapClaims{
		"sub": userID,                     // Subject (user ID)
		"exp": time.Now().Add(24 * time.Hour).Unix(), // Expires in 24h
		"iat": time.Now().Unix(),          // Issued at
	}

	// 2. Create token with HS256 algorithm
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// 3. Sign the token with your secret key
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func LoginHandler(c *gin.Context) {
    // 1. Parse request
    var req struct {
        Email    string `json:"email" binding:"required,email"`
        Password string `json:"password" binding:"required"`
    }

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": "Invalid request format"})
        return
    }

    // 2. Check user exists
    var storedPassword string
    var userID string
    err := config.DB.QueryRow(
        "SELECT id, password FROM users WHERE email = $1", 
        req.Email,
    ).Scan(&userID, &storedPassword)

    if err != nil {
        if err == sql.ErrNoRows {
            c.JSON(401, gin.H{"error": "Invalid email or password"})
        } else {
            c.JSON(500, gin.H{"error": "Database error"})
        }
        return
    }

	log.Printf("Login attempt - Email: %s", req.Email)
log.Printf("Input password length: %d", len(req.Password))
log.Printf("Stored hash: %s", storedPassword)
log.Printf("Hash length: %d", len(storedPassword))

    // 3. Verify password
    if err := bcrypt.CompareHashAndPassword(
        []byte(storedPassword), 
        []byte(req.Password),
    ); err != nil {
        c.JSON(401, gin.H{"error": "Invalid email or password"})
        return
    }

    // 4. Generate token
    token, err := GenerateJWT(userID)
    if err != nil {
        c.JSON(500, gin.H{"error": "Failed to generate token"})
        return
    }

    c.JSON(200, gin.H{
        "success": true,
        "token":   token,
        "user_id": userID,
    })
}

