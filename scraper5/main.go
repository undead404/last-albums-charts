package main

import (
	"fmt"
	"lac/scraper5/buildDeploy"
	"lac/scraper5/scrape"
	"lac/scraper5/utils"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	utils.SetupLog()
	defer utils.CloseLog()
	err := godotenv.Load()
	utils.HandleError(err, "main.go:main:godotenv.Load")
	// errorChannel := make(chan error)
	// go errorMonitor.New(errorChannel).Run()
	fmt.Println("Hello, world.")
	controlChannel := make(chan int, 1)
	counter := 0
	go scrape.New(controlChannel).Run()
	go buildDeploy.New(controlChannel).Run()
	log.Println("Goroutines started")
	for {
		counter += <-controlChannel
		if counter <= 0 {
			break
		}
	}
	// utils.WaitForInterruption()
}
