package utils

import "testing"

func TestReadFromTestTextFile(t *testing.T) {
	lines, err := ReadLinesFromFile("test.txt")
	if err != nil {
		t.Error(err)
	}
	if len(lines) != 2 {
		t.Error("Expected 2 lines, got ", len(lines))
	}
	if lines[0] != "This is the first line." {
		t.Error("Expected 'This is the first line.', got ", lines[0])
	}
	if lines[1] != "This is the second line." {
		t.Error("Expected 'This is the second line.', got ", lines[1])
	}
}
