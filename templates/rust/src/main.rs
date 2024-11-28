fn main() {
    let input = std::fs::read_to_string("input.txt").unwrap();
    println!("Part One: {}", part_one(&input));
    //**scaf**|println!("Part Two: {}", part_two(&input));
}

fn part_one(input: &str) -> i32 {
    -1
}

//**scaf**|fn part_two(input: &str) -> i32 {
//**scaf**|    -1
//**scaf**|}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part_one_example() {
        let input = "{{INPUT_1}}";
        assert_eq!(part_one(input), {{ANSWER_1}});
    }

    //**scaf**|#[test]
    //**scaf**|fn part_two_example() {
    //**scaf**|    let input = "{{INPUT_2}}";
    //**scaf**|    assert_eq!(part_two(input), {{ANSWER_2}});
    //**scaf**|}
}
