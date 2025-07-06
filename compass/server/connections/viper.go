package connections

import (
	
	"fmt"
	"path/filepath"

	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

// func init() {
// 	setupViper()
// }

func viperConfig() {
	// Base configuration
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AddConfigPath(filepath.Join("..", "config"))
	viper.AddConfigPath("/etc/compass/")

	// Load main config
	viper.SetConfigName("config")
	if err := viper.ReadInConfig(); err != nil {
		logrus.Errorf("Error reading config file: %v", err)
	}

	// Load secrets (optional)
	viper.SetConfigName("secret")
	if err := viper.MergeInConfig(); err != nil {
		logrus.Warnf("No secret config found: %v", err)
	}

	// Environment variables override
	viper.AutomaticEnv()

	// Set defaults for critical values
	setDefaults()
}

func setDefaults() {
	viper.SetDefault("environment", "development")
	viper.SetDefault("server.auth.port", "8080")
	viper.SetDefault("server.maps.port", "8081")
	viper.SetDefault("logging.level", "debug")
	viper.SetDefault("logging.format", "text")
	viper.SetDefault("logging.file", "")
	viper.SetDefault("database.max_connections", 20)
}

// Configuration accessors
func GetAuthPort() string {
	return viper.GetString("server.auth.port")
}

func GetMapsPort() string {
	return viper.GetString("server.maps.port")
}

func GetDatabaseDSN() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		viper.GetString("database.host"),
		viper.GetString("database.port"),
		viper.GetString("database.user"),
		viper.GetString("database.password"),
		viper.GetString("database.name"),
	)
}

// Add these functions to your existing viper.go file
func IsProduction() bool {
	return viper.GetString("environment") == "production"
}

func IsDevelopment() bool {
	return viper.GetString("environment") == "development"
}

func IsStaging() bool {
	return viper.GetString("environment") == "staging"
}