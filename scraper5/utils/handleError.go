package utils

import (
	"log"
	"os"
)

// If err is not nil, log the error and exit the program
func HandleError(err error, location string) {
	if err != nil {
		log.Fatal(location, "error", err)
		os.Exit(1)
	}
}
