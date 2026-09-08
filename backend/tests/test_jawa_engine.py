import unittest
from datetime import date

from engines.jawa_engine import jawa_from_gregorian


class JawaEngineRegressionTests(unittest.TestCase):
    def test_java_calendar_origin_anchor(self):
        result = jawa_from_gregorian(1633, 7, 8)

        self.assertEqual(result["day"], 1)
        self.assertEqual(result["month"], 1)
        self.assertEqual(result["monthName"], "Sura")
        self.assertEqual(result["year"], 1555)
        self.assertEqual(result["yearName"], "Alip")
        self.assertEqual(result["dayName"], "Jemuwah")
        self.assertEqual(result["pasaran"], "Legi")
        self.assertEqual(result["weton"], "Jemuwah Legi")
        self.assertEqual(result["windu"], "Kuntara")
        self.assertEqual(result["lambang"], "Kulawu")
        self.assertEqual(result["kurup"], "Jamingiyah")

    def test_modern_weton_regression_anchor(self):
        result = jawa_from_gregorian(2024, 8, 17)

        self.assertEqual(result["day"], 11)
        self.assertEqual(result["monthName"], "Sapar")
        self.assertEqual(result["year"], 1958)
        self.assertEqual(result["dayName"], "Setu")
        self.assertEqual(result["pasaran"], "Legi")
        self.assertEqual(result["weton"], "Setu Legi")
        self.assertEqual(result["wuku"], "Tolu")
        self.assertEqual(result["windu"], "Sancaya")
        self.assertEqual(result["lambang"], "Kulawu")
        self.assertEqual(result["kurup"], "Salasiyah")

    def test_date_before_java_calendar_origin_is_rejected(self):
        with self.assertRaises(ValueError):
            jawa_from_gregorian(1633, 7, 7)


if __name__ == "__main__":
    unittest.main()
