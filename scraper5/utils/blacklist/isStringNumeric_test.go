package blacklist

import "testing"

func TestOnNumeric(t *testing.T) {
	if !isStringNumeric("123") {
		t.Error("123 is numeric")
	}
}
func TestOnNonNumeric(t *testing.T) {
	if isStringNumeric("123a") {
		t.Error("123a is not numeric")
	}
}

func TestOnBlank(t *testing.T) {
	if isStringNumeric("") {
		t.Error("empty string is not numeric")
	}
}
