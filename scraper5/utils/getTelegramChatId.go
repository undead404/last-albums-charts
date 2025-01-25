package utils

import (
	"os"
	"strconv"
)

func GetTelegramChatId() int64 {
	str := os.Getenv("TELEGRAM_CHAT_ID")
	result, err := strconv.ParseInt(str, 10, 64)
	HandleError(err, "utils/getTelegramChatId.go:GetTelegramChatId")
	return result
}
