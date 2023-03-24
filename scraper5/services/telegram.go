package services

import (
	"lac/scraper5/utils"
	"log"
	"os"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func initBot() *tgbotapi.BotAPI {
	bot, err := tgbotapi.NewBotAPI(os.Getenv("TELEGRAM_BOT_TOKEN"))
	if err != nil {
		utils.HandleError(err)
	}

	bot.Debug = true
	return bot
}

var bot *tgbotapi.BotAPI

func NotifyTelegram(message string) {
	if bot == nil {
		bot = initBot()
	}
	_, err := bot.Send(tgbotapi.NewMessage(utils.GetTelegramChatId(), "#go "+message))
	if err != nil {
		log.Println(err.Error())
	}
}
