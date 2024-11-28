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

/**scaf**
func TestPartTwo(t *testing.T) {
 	input := `{{INPUT_2}}`
 	expected := {{ANSWER_2}} 
 
 	output := PartTwo(input)
 
 	if output != expected {
 		t.Errorf("Output is %v, expeced %v", output, expected)
 	}
}
 **scaf**/
