package models

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/microcosm-cc/bluemonday"
	"gorm.io/gorm"
)

// Custom UUID type that wraps google/uuid for additional control
type UUID uuid.UUID

// SafeHTML type for sanitized HTML content
type SafeHTML string

// BaseModel contains common fields for all models
type BaseModel struct {
	ID        UUID           `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

// NoticeCard represents a notice card with HTML content
type Notice struct {
	BaseModel
	CardTitle       string   `gorm:"not null"`
	CardDescription string   `gorm:"not null"` // Changed from lowercase to exported
	NoticePreview   string   `gorm:"not null"` // Changed from lowercase to exported
	Description     SafeHTML `gorm:"type:text"` // Corrected field name
}
type UpdateNoticeRequest struct {
	CardTitle       *string   `json:"cardTitle"`       // Optional (pointer)
    CardDescription *string   `json:"cardDescription"` // Optional (pointer)
    NoticePreview   *string   `json:"noticePreview"`   // Optional (pointer)
    Description     *SafeHTML `json:"description"`     // Optional (pointer)
}
// --- UUID Methods ---

// Scan implements the sql.Scanner interface for UUID
func (u *UUID) Scan(value interface{}) error {
	return (*uuid.UUID)(u).Scan(value)
}

// Value implements the driver.Valuer interface for UUID
func (u UUID) Value() (driver.Value, error) {
	return uuid.UUID(u).Value()
}

// --- SafeHTML Methods ---

// Scan implements the sql.Scanner interface for SafeHTML
func (h *SafeHTML) Scan(value interface{}) error {
	if value == nil {
		*h = ""
		return nil
	}

	var stringValue string
	switch v := value.(type) {
	case []byte:
		stringValue = string(v)
	case string:
		stringValue = v
	default:
		return fmt.Errorf("unsupported type for SafeHTML: %T", value)
	}

	// Sanitize HTML using bluemonday's strictest policy
	sanitized := bluemonday.UGCPolicy().Sanitize(stringValue)
	*h = SafeHTML(sanitized)
	return nil
}

// Value implements the driver.Valuer interface for SafeHTML
func (h SafeHTML) Value() (driver.Value, error) {
	return string(h), nil // No sanitization needed when saving to DB
}

// --- Hooks ---

// BeforeCreate ensures UUID is set before creating records
func (m *BaseModel) BeforeCreate(tx *gorm.DB) error {
	if m.ID == UUID(uuid.Nil) {
		newUUID, err := uuid.NewRandom()
		if err != nil {
			return fmt.Errorf("failed to generate UUID: %w", err)
		}
		m.ID = UUID(newUUID)
	}
	return nil
}

// --- Helper Functions ---

// String returns the string representation of UUID
func (u UUID) String() string {
	return uuid.UUID(u).String()
}

// ParseUUID parses a string into UUID
func ParseUUID(s string) (UUID, error) {
	parsed, err := uuid.Parse(s)
	return UUID(parsed), err
}

// MarshalJSON converts UUID to string format
func (u UUID) MarshalJSON() ([]byte, error) {
    return json.Marshal(uuid.UUID(u).String())
}

// UnmarshalJSON parses string into UUID
func (u *UUID) UnmarshalJSON(data []byte) error {
    var s string
    if err := json.Unmarshal(data, &s); err != nil {
        return err
    }
    id, err := uuid.Parse(s)
    if err != nil {
        return err
    }
    *u = UUID(id)
    return nil
}
