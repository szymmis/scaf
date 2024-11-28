package main

import "testing"

func TestPartOne(t *testing.T) {
	input := `{{INPUT_1}}`
	expected := {{ANSWER_1}}

	output := PartOne(input)

	if output != expected {
		t.Errorf("Output is %v, expeced %v", output, expected)
	}
}

//**scaf**|func TestPartTwo(t *testing.T) {
//**scaf**|	input := `{{INPUT_2}}`
//**scaf**|	expected := {{ANSWER_2}} 
//**scaf**|
//**scaf**|	output := PartTwo(input)
//**scaf**|
//**scaf**|	if output != expected {
//**scaf**|		t.Errorf("Output is %v, expeced %v", output, expected)
//**scaf**|	}
//**scaf**|}
