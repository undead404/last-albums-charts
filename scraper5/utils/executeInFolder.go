package utils

import (
	"bufio"
	"fmt"
	"os/exec"
)

func ExecuteInFolder(folder string, name string, args ...string) error {
	command := exec.Command(name, args...)
	command.Dir = folder
	stdout, err := command.StdoutPipe()
	command.Start()

	scanner := bufio.NewScanner(stdout)
	scanner.Split(bufio.ScanWords)
	for scanner.Scan() {
		m := scanner.Text()
		fmt.Println(m)
	}
	command.Wait()
	return err
}
