package utils

import (
	"strings"
)

const MAX_MESSAGE_LENGTH = 4096

var escapeReplacer = strings.NewReplacer(
	"_", "\\_",
	"*", "\\*",
	"[", "\\[",
	"]", "\\]",
	"(", "\\(",
	")", "\\)",
	"~", "\\~",
	"`", "\\`",
	">", "\\>",
	"#", "\\#",
	"+", "\\+",
	"-", "\\-",
	"=", "\\=",
	"|", "\\|",
	"{", "\\{",
	"}", "\\}",
	".", "\\.",
	"!", "\\!",
)

func truncateMessage(message string) string {
	return truncate(message, MAX_MESSAGE_LENGTH, "\n")
}

func EscapeTelegramMessage(message string) string {
	return truncateMessage(
		escapeReplacer.Replace(message)[:MAX_MESSAGE_LENGTH],
	)
}

func truncate(s string, length int, separator string) string {
	if len(s) <= length {
		return s
	}
	idx := strings.LastIndex(s[:length], separator)
	if idx == -1 {
		return s[:length]
	}
	return s[:idx]
}
