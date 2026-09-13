import unittest

from engines.jodoh_engine import get_jodoh


class JodohEngineTests(unittest.TestCase):
    def test_eight_cycle(self):
        result = get_jodoh(9, 14)

        self.assertEqual(result["total_neptu"], 23)
        self.assertEqual(result["remainder"], 7)
        self.assertEqual(result["name"], "Sujanan")

    def test_zero_remainder_is_eight(self):
        result = get_jodoh(9, 15)

        self.assertEqual(result["total_neptu"], 24)
        self.assertEqual(result["remainder"], 8)
        self.assertEqual(result["name"], "Pesthi")

    def test_invalid_neptu_is_rejected(self):
        with self.assertRaises(ValueError):
            get_jodoh(0, 14)


if __name__ == "__main__":
    unittest.main()
