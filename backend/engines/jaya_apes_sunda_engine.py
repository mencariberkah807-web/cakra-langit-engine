SOURCE_ID = "SSOT-PARIRIMBON-JABAR"
SOURCE_TITLE = "PARIRIMBON SUNDA (JAWA BARAT).pdf"
# Directly validated source baseline.
JAYA_APES_BASELINE = {
    ("Senen", "Pahing"): {
        "wedal": 12,
        "jaya": "Saptu",
        "apes": "Kemis",
    },
    ("Senin", "Pahing"): {
        "wedal": 12,
        "jaya": "Saptu",
        "apes": "Kemis",
    },
}

def calculate_jaya_apes(
    day_name: str,
    pasaran: str,
    wedal: int | None = None,
):
    item = JAYA_APES_BASELINE.get((day_name, pasaran))
    if item is None:
        return {
            "status": "PARTIAL_DATASET",
            "day": day_name,
            "pasaran": pasaran,
            "wedal": wedal,
            "jaya": None,
            "apes": None,
            "source": {
                "source_id": SOURCE_ID,
                "source_title": SOURCE_TITLE,
            },
            "note": "Complete personal Jaya/Apes lookup matrix has not yet been recovered. No value is inferred for missing birth combinations.",
        }

    return {
        "status": "VERIFIED_BASELINE",
        "day": day_name,
        "pasaran": pasaran,
        "wedal": item["wedal"],
        "jaya": item["jaya"],
        "apes": item["apes"],
        "source": {
            "source_id": SOURCE_ID,
            "source_title": SOURCE_TITLE,
            "lineage": "validated Senin Pahing baseline",
        },
    }
