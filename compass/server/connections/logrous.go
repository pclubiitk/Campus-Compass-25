// // Set up Logrus with formatting, log levels, file outputs etc.
// package connections

// import (
// 	"fmt"
// 	"path/filepath"
// 	"runtime"
// 	"time"

// 	"github.com/sirupsen/logrus"
// )

// func logrusConfig() {
// 	logrus.SetLevel(logrus.DebugLevel) // sets the minimum log level for Logrus.
// 	// SetReportCaller enables automatic inclusion of the calling function's file name and line number, SetFormatter is used to customize the log format
// 	logrus.SetFormatter(&logrus.TextFormatter{
// 		TimestampFormat: time.DateTime, // "2006-01-02 15:04:05"
// 		FullTimestamp:   true,
// 		CallerPrettyfier: func(f *runtime.Frame) (string, string) {
// 			filename := filepath.Base(f.File) // Just the filename
// 			return "", fmt.Sprintf(" %s:%d", filename, f.Line)
// 		},
// 	})
// 	logrus.SetReportCaller(true)
// }
package connections

import (
	"os"
	"path/filepath"
	"runtime"
	"time"
    "github.com/spf13/viper"
	"github.com/sirupsen/logrus"
	"fmt"
)

// func init() {
// 	setupLogrus()
// }

func logrusConfig() {
	// Set log level from config
	if level, err := logrus.ParseLevel(viper.GetString("logging.level")); err == nil {
		logrus.SetLevel(level)
	} else {
		logrus.SetLevel(logrus.InfoLevel)
		logrus.Warnf("Invalid log level '%s', defaulting to INFO", viper.GetString("logging.level"))
	}

	// Configure formatter based on config
	switch viper.GetString("logging.format") {
	case "json":
		logrus.SetFormatter(&logrus.JSONFormatter{
			TimestampFormat: time.RFC3339Nano,
			FieldMap: logrus.FieldMap{
				logrus.FieldKeyTime:  "timestamp",
				logrus.FieldKeyLevel: "level",
				logrus.FieldKeyMsg:   "message",
				logrus.FieldKeyFunc:  "caller",
			},
		})
	default:
		logrus.SetFormatter(&logrus.TextFormatter{
			TimestampFormat:  time.DateTime,
			FullTimestamp:    true,
			PadLevelText:     true,
			ForceColors:      true,
			QuoteEmptyFields: true,
			CallerPrettyfier: func(f *runtime.Frame) (string, string) {
				filename := filepath.Base(f.File)
				return "", fmt.Sprintf("%s:%d", filename, f.Line)
			},
		})
	}

	// Enable caller information if debug level
	if logrus.GetLevel() >= logrus.DebugLevel {
		logrus.SetReportCaller(true)
	}

	// File output if configured
	if logFile := viper.GetString("logging.file"); logFile != "" {
		if err := os.MkdirAll(filepath.Dir(logFile), 0755); err != nil {
			logrus.Errorf("Failed to create log directory: %v", err)
		} else if file, err := os.OpenFile(logFile, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666); err == nil {
			logrus.SetOutput(file)
		} else {
			logrus.Errorf("Failed to log to file: %v", err)
		}
	}
}