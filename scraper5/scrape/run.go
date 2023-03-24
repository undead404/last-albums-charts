package scrape

import (
	"lac/scraper5/interfaces"
	"lac/scraper5/utils"
	"log"
)

type ScrapeSubApp struct {
	interfaces.SubApp
}

func (this *ScrapeSubApp) Run() {
	defer utils.NotifyAboutEnd(&this.SubApp)
	utils.NotifyAboutStart(&this.SubApp)
	log.Println("Starts to scrape")
}

func New(controlChannel chan int) *ScrapeSubApp {
	return &ScrapeSubApp{
		interfaces.SubApp{
			ControlChannel: controlChannel,
		},
	}
}
