// Initialize routes related to authentication: /login, /signup, /logout
// Use handlers defined in a separate file
package auth

import (
	"github.com/gin-gonic/gin"
)

func Router(r *gin.Engine) {
	auth := r.Group("/api/auth")
	{
		auth.POST("/login", LoginHandler)
		auth.POST("/signup", signupHandler)
		// auth.GET("/logout", logoutHandler)
		// auth.GET("/verify", verificationHandler)
	}
}


// package auth

// import (
// 	"github.com/gin-gonic/gin"
// )


// func SetupRoutes(r *gin.Engine) {
// 	authGroup := r.Group("/api/auth")
// 	{
// 		authGroup.POST("/signup", SignupHandler)
// 		authGroup.POST("/login", LoginHandler)
// 	}
// }