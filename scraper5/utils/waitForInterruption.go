package utils

import (
	"os"
	"os/signal"
)

func WaitForInterruption() {
	interruption := make(chan os.Signal, 1)
	signal.Notify(interruption, os.Interrupt)
	<-interruption
}
