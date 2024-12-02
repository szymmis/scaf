package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	data, _ := os.ReadFile("input.txt")
	input := strings.Split(strings.TrimSpace(string(data)), "\n")

	fmt.Printf("Part One: %v\n", PartOne(input))
	//**scaf**|fmt.Printf("Part Two: %v\n", PartTwo(input))
}

func PartOne(input []string) int {
	return -1
}

//**scaf**|func PartTwo(input []string) int {
//**scaf**|	return -1
//**scaf**|}
