package auth

import  (
"compass/config"
	"log"
	// "mime/multipart"
	

	"github.com/gin-gonic/gin"
	
	"golang.org/x/crypto/bcrypt"
	"database/sql"
	// "github.com/golang-jwt/jwt/v5"
)
       

// func loginHandler(c *gin.Context) {
// 	// define the login request model in the request model as per need

// 	// Verify the password hash with the provided password

// 	// on verification create a valid jwt token having the role of the user, (admin, user)
// 	// using the middleware token function, you are required to write the token generator and verifier code

// 	// Save the token in cookie

// 	// Handle all the edge cases with suitable return http code, write them in the read me for later documentation


// }
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

