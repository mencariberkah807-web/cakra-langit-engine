import unittest

from engines.palintangan_sunda_engine import calculate_jaya_apes


class PalintanganJayaApesTests(unittest.TestCase):
    def test_reference_anchor_senen_pahing(self):
        result = calculate_jaya_apes("Senen", 13)

        self.assertEqual(result["jaya"], "Setu")
        self.assertEqual(result["apes"], "Kemis")
        self.assertEqual(result["jaya_index"], 6)
        self.assertEqual(result["apes_index"], 4)
        self.assertEqual(result["status"], "CAKRA_LANGIT_RECONSTRUCTED")

    def test_jaya_cycle_is_seven(self):
        values = [calculate_jaya_apes("Senen", n)["jaya_index"] for n in range(7, 21)]
        self.assertEqual(values[:7], [0, 1, 2, 3, 4, 5, 6])
        self.assertEqual(values[7:], [0, 1, 2, 3, 4, 5, 6, 0])

    def test_apes_is_two_steps_before_jaya(self):
        for naktu in range(7, 21):
            result = calculate_jaya_apes("Senen", naktu)
            self.assertEqual((result["apes_index"] - result["jaya_index"]) % 7, 5)


if __name__ == "__main__":
    unittest.main()
