import unittest
from unittest.mock import patch

from engines import future_natural_engine as engine


class VolcanicCatalogStatusTests(unittest.TestCase):
    def test_successful_catalog_lookup_is_not_labeled_live(self):
        payload = {
            "features": [
                {
                    "properties": {
                        "Volcano_Name": "Tangkuban Parahu",
                        "Volcano_Number": "263090",
                    },
                    "geometry": {"coordinates": [107.60, -6.77]},
                }
            ]
        }

        with patch.object(engine, "_get_json", return_value=payload):
            result = engine._fetch_volcanic(-6.9, 107.6)

        self.assertTrue(result["available"])
        self.assertIn("catalog", result["secondary"].lower())
        self.assertNotIn("live", result["secondary"].lower())
        self.assertTrue(
            any(
                detail["label"] == "Status"
                and "does not indicate current volcanic activity" in detail["value"]
                for detail in result["details"]
            )
        )

    def test_empty_catalog_result_does_not_claim_live_status(self):
        with patch.object(engine, "_get_json", return_value={"features": []}):
            result = engine._fetch_volcanic(-6.9, 107.6)

        self.assertNotIn("live", result["secondary"].lower())


if __name__ == "__main__":
    unittest.main()
