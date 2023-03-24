package utils

import (
	"log"
	"os"
)

func HandleError(err error) {
	if err != nil {
		log.Fatal("error: ", err)
		os.Exit(1)
	}
}
