package buildDeploy

import (
	"lac/scraper5/interfaces"
	"lac/scraper5/services"
	"lac/scraper5/utils"
	"log"
	"path/filepath"

	"github.com/braswelljr/rmx/rm"
)

type BuildDeploySubApp struct {
	interfaces.SubApp
}

var rootFolder = ".."
var siteFolder = filepath.Join(rootFolder, "site4")
var siteDistFolder = filepath.Join(siteFolder, "dist")

func removeDistFolder() {
	err := rm.RemoveAll(siteDistFolder)
	utils.HandleError((err))
}

func build() {
	err := utils.ExecuteInFolder(siteFolder, "yarn", "build")
	utils.HandleError(err)
	services.NotifyTelegram("Збирання завершено")
}

func deploy() {
	err := utils.ExecuteInFolder(rootFolder, "firebase", "deploy", "--only", "hosting")
	utils.HandleError(err)
	services.NotifyTelegram("Оновлення завершено")
}

func (this *BuildDeploySubApp) Run() {
	defer utils.NotifyAboutEnd(&this.SubApp)
	utils.NotifyAboutStart(&this.SubApp)
	log.Println("Starts build & deploy")
	removeDistFolder()
	build()
	deploy()

}

func New(controlChannel chan int) *BuildDeploySubApp {
	return &BuildDeploySubApp{
		interfaces.SubApp{
			ControlChannel: controlChannel,
		},
	}
}
