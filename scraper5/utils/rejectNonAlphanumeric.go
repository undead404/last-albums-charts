package utils

func RejectNonAlphanumeric(text string) string {
	var newText string
	for _, char := range text {
		if char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z' || char >= '0' && char <= '9' {
			newText += string(char)
		}
	}
	return newText
}
