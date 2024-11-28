package main

import (
	"fmt"
	"os"
)

func main() {
	data, _ := os.ReadFile("input.txt")
	input := string(data)

	fmt.Printf("Part One: %v", PartOne(input))
	/**scaf**fmt.Printf("Part Two: %v", PartTwo(input))**scaf**/
}

func PartOne(input string) int {
	return -1
}

/**scaf**
func PartTwo(input string) int {
	return -1
}
**scaf**/
