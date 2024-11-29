import unittest

from main import part_one  #**scaf**|, part_two


class TestParts(unittest.TestCase):
    def test_part_one(self):
        input = """{{INPUT_1}}"""
        self.assertEqual(part_one(input), {{ANSWER_1}})

    #**scaf**|def test_part_two(self):
    #**scaf**|   input = """{{INPUT_2}}"""
    #**scaf**|   self.assertEqual(part_two(input), {{ANSWER_2}})


if __name__ == "__main__":
    unittest.main()
