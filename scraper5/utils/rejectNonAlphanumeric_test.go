package utils

import "testing"

func TestOnStringWithHyphen(t *testing.T) {
	input := "a-b"
	expected := "ab"
	actual := RejectNonAlphanumeric(input)
	if actual != expected {
		t.Errorf("Expected %s, got %s", expected, actual)
	}
}

func TestOnAlphanumeric(t *testing.T) {
	input := "abc123"
	expected := "abc123"
	actual := RejectNonAlphanumeric(input)
	if actual != expected {
		t.Errorf("Expected %s, got %s", expected, actual)
	}
}

func TestOnBlank(t *testing.T) {
	input := ""
	expected := ""
	actual := RejectNonAlphanumeric(input)
	if actual != expected {
		t.Errorf("Expected %s, got %s", expected, actual)
	}
}

func TestOnUnderscorePrefixed(t *testing.T) {
	input := "_abc"
	expected := "abc"
	actual := RejectNonAlphanumeric(input)
	if actual != expected {
		t.Errorf("Expected %s, got %s", expected, actual)
	}
}

func TestWithMultipleMiscCharacters(t *testing.T) {
	input := "a-b_c"
	expected := "abc"
	actual := RejectNonAlphanumeric(input)
	if actual != expected {
		t.Errorf("Expected %s, got %s", expected, actual)
	}
}
