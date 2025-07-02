package auth

import "time"

type User struct {
    ID                string    `json:"id"`
    Email             string    `json:"email" binding:"required,email"`
    Password          string    `json:"-"` // Hidden from JSON responses
    ProfileImage      string    `json:"profile_image"`
    RegistrationDate  time.Time `json:"registration"`
    LastUpdate        time.Time `json:"last_update"`
    IsVerified        bool      `json:"is_verified"`
}

type LoginRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=6"`
}