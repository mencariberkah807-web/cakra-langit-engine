import unittest

from engines.palintangan_sunda_engine import (
    DINO_NAKTU,
    GAGALANG_PASARAN,
    GAGALANG_POE_MONTHS,
    MONTH_RULES,
    PASARAN_NAKTU,
    PERNAASAN,
    WATEK_PATOKAN,
    calculate_jaya_apes,
    normalize_hijri_month,
)


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

    def test_locked_naktu_tables(self):
        self.assertEqual(DINO_NAKTU["Senen"], 4)
        self.assertEqual(DINO_NAKTU["Kemis"], 8)
        self.assertEqual(DINO_NAKTU["Ngahad"], 5)
        self.assertEqual(PASARAN_NAKTU["Pahing"], 9)
        self.assertEqual(PASARAN_NAKTU["Wage"], 4)
        self.assertEqual(PASARAN_NAKTU["Kliwon"], 8)

    def test_locked_watek_and_gagalang_tables(self):
        self.assertEqual(len(WATEK_PATOKAN), 12)
        self.assertEqual(WATEK_PATOKAN["Muharam"]["watek"], "Wani")
        self.assertEqual(WATEK_PATOKAN["Rayagung"]["watek"], "Alas Kobar")
        self.assertEqual(GAGALANG_POE_MONTHS["Puasa"]["hari"], "Rebo")
        self.assertEqual(GAGALANG_POE_MONTHS["Puasa"]["watek"], "Demang Kanduruan")
        self.assertEqual(GAGALANG_PASARAN["Pahing"]["direction"], "Barat")

    def test_locked_pernaasan_and_navigation_groups(self):
        self.assertEqual(PERNAASAN["Muharam"], [3, 12, 20])
        self.assertEqual(PERNAASAN["Puasa"], [9, 20, 29])
        self.assertEqual(PERNAASAN["Sawal"], [])
        self.assertEqual(MONTH_RULES["Muharam"]["rizki_direction"], "Tenggara")
        self.assertEqual(MONTH_RULES["Rabiulakhir"]["rizki_direction"], "Barat Laut")
        self.assertEqual(MONTH_RULES["Rajab"]["rizki_direction"], "Barat Daya")
        self.assertEqual(MONTH_RULES["Sawal"]["rizki_direction"], "Timur Laut")

    def test_hijri_aliases_normalize_to_sunda_months(self):
        self.assertEqual(normalize_hijri_month("Muharram"), "Muharam")
        self.assertEqual(normalize_hijri_month("Sha'ban"), "Rewah")
        self.assertEqual(normalize_hijri_month("Sya'ban"), "Rewah")
        self.assertEqual(normalize_hijri_month("Ramadan"), "Puasa")
        self.assertEqual(normalize_hijri_month("Zulkaidah"), "Dulkaidah")
        self.assertEqual(normalize_hijri_month("Zulhijah"), "Rayagung")
        self.assertEqual(normalize_hijri_month("Dzulhijah"), "Rayagung")

    def test_apes_is_two_steps_before_jaya(self):
        for naktu in range(7, 21):
            result = calculate_jaya_apes("Senen", naktu)
            self.assertEqual((result["apes_index"] - result["jaya_index"]) % 7, 5)


if __name__ == "__main__":
    unittest.main()
