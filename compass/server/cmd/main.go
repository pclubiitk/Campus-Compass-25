package main

import (
	_ "compass/connections" // is a blank import and it runs the init() functions in the package
	"compass/workers"
	"time"
	"github.com/sirupsen/logrus"
	"golang.org/x/sync/errgroup"
)

const (
	readTimeout  = 5 * time.Second  // Maximum duration for reading the entire request, Prevents a slow client from holding the connection open indefinitely while slowly sending data
	writeTimeout = 10 * time.Second // Maximum duration before timing out when writing the response to the client, Prevents the server from being stuck forever while trying to send data to a slow or unresponsive client.
)

func main() {
	// Create an error group to handle errors together
	var g errgroup.Group

	// In Production mode, will not print the routes as done in debug mode
	// gin.SetMode(gin.ReleaseMode)

	// The concurrent workers running in background.
	// For now we are keeping them as background workers, as we expand, we can later convert them in to independent services.
	g.Go(func() error {
		return workers.ModeratorWorker()
	})
	g.Go(func() error {
		return workers.MailingWorker()
	})
	g.Go(func() error { return authServer().ListenAndServe() })
	g.Go(func() error { return mapsServer().ListenAndServe() })
	logrus.Info("Main server is Starting...")
	if err := g.Wait(); err != nil {
		logrus.Fatal("Some service failed with error: ", err)
	}

}
// package main

// import (
// 	"compass/connections"
// 	"compass/auth"
// 	"compass/maps"
// 	"compass/workers"
// 	"time"

// 	"github.com/sirupsen/logrus"
// 	"golang.org/x/sync/errgroup"
// 	"github.com/gin-gonic/gin"
// )

// const (
// 	readTimeout  = 5 * time.Second
// 	writeTimeout = 10 * time.Second
// )

// func main() {
// 	// Initialize configuration and logging via connections package
// 	// (assuming connections/viper.go and connections/logrous.go have init() functions)
	
// 	// Create an error group to handle errors together
// 	var g errgroup.Group

// 	// Set production mode if configured
// 	// if connections.IsProduction() {
// 	// 	logrus.Info("Running in production mode")
// 	// 	// gin.SetMode(gin.ReleaseMode)
// 	// }

// 	if connections.IsProduction() {
//     logrus.Info("Running in production mode")
//     gin.SetMode(gin.ReleaseMode)
    
//     // Production-specific configuration
//     logrus.SetFormatter(&logrus.JSONFormatter{})
// } else {
//     logrus.Debug("Running in development mode")
//     // Development-specific configuration
// }

// 	// Start background workers
// 	g.Go(func() error {
// 		logrus.Info("Starting Moderator Worker")
// 		return workers.ModeratorWorker()
// 	})
// 	g.Go(func() error {
// 		logrus.Info("Starting Mailing Worker")
// 		return workers.MailingWorker()
// 	})

// 	// Start servers with configured ports
// 	g.Go(func() error {
// 		server := auth.NewServer(
// 			connections.GetAuthPort(),
// 			readTimeout,
// 			writeTimeout,
// 		)
// 		logrus.Infof("Auth server starting on :%s", connections.GetAuthPort())
// 		return server.ListenAndServe()
// 	})

// 	g.Go(func() error {
// 		server := maps.NewServer(
// 			connections.GetMapsPort(),
// 			readTimeout,
// 			writeTimeout,
// 		)
// 		logrus.Infof("Maps server starting on :%s", connections.GetMapsPort())
// 		return server.ListenAndServe()
// 	})

// 	logrus.Info("All services starting...")
// 	if err := g.Wait(); err != nil {
// 		logrus.Fatal("Service failed: ", err)
// 	}
// }