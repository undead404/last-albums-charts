package utils

import (
	"log"
	"os"
)

var logFile *os.File

func CloseLog() {
	logFile.Close()
}

func SetupLog() {
	var err error
	logFile, err = os.OpenFile("log.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	log.SetOutput(logFile)
}
