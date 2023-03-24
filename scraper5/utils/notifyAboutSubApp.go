package utils

import "lac/scraper5/interfaces"

func NotifyAboutEnd(subApp *interfaces.SubApp) {
	subApp.ControlChannel <- -1
}

func NotifyAboutStart(subApp *interfaces.SubApp) {
	subApp.ControlChannel <- 1
}
