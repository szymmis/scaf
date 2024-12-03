package main

import (
	"strings"
	"testing"
)

func TestPartOne(t *testing.T) {
	input := strings.Split(`{{INPUT_1}}`, "\n")
	expected := {{ANSWER_1}}

	output := PartOne(input)

	if output != expected {
		t.Errorf("Output is %v, expeced %v", output, expected)
	}
}

//**scaf**|func TestPartTwo(t *testing.T) {
//**scaf**|	input := strings.Split(`{{INPUT_2}}`, "\n")
//**scaf**|	expected := {{ANSWER_2}} 
//**scaf**|
//**scaf**|	output := PartTwo(input)
//**scaf**|
//**scaf**|	if output != expected {
//**scaf**|		t.Errorf("Output is %v, expeced %v", output, expected)
//**scaf**|	}
//**scaf**|}
