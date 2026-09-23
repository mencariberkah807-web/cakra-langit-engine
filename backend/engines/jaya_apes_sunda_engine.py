SOURCE_ID = "SSOT-PARIRIMBON-JABAR"
SOURCE_TITLE = "PARIRIMBON SUNDA (JAWA BARAT).pdf"
RESEARCH_SOURCE_ID = "CHAT-RESEARCH-2026-08-28"
RESEARCH_SOURCE_TITLE = "Palintangan Sunda — hasil riset chat terdokumentasi"

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

# Observed Jaya/Apes cases documented during the earlier Palintangan research.
# These are preserved as research observations only; they are NOT treated as
# a complete 210-combination formula or used to infer missing combinations.
JAYA_APES_OBSERVED_CASES = {
    "2026-08-22": {"jaya": "Jaya Semah", "apes": "Manggih Harja"},
    "2026-08-23": {"jaya": "Pada Jaya", "apes": "Manggih Susah"},
    "2026-08-24": {"jaya": "Jaya Semah", "apes": "Manggih Pati"},
    "2026-08-25": {"jaya": "Jaya Pribumi", "apes": "Manggih Wirang"},
    "2026-08-26": {"jaya": "Pada Apes", "apes": "Manggih Harja"},
    "2026-08-27": {"jaya": "Pada Jaya", "apes": "Manggih Harja"},
}


def calculate_jaya_apes(
    day_name: str,
    pasaran: str,
    wedal: int | None = None,
    target_date: str | None = None,
):
    if target_date and target_date in JAYA_APES_OBSERVED_CASES:
        observed = JAYA_APES_OBSERVED_CASES[target_date]
        return {
            "status": "VERIFIED_RESEARCH_CASE",
            "day": day_name,
            "pasaran": pasaran,
            "wedal": wedal,
            "jaya": observed["jaya"],
            "apes": observed["apes"],
            "date": target_date,
            "source": {
                "source_id": RESEARCH_SOURCE_ID,
                "source_title": RESEARCH_SOURCE_TITLE,
                "lineage": "documented research observation; not a complete lookup matrix",
            },
            "note": "Observed research case is preserved verbatim. It is not generalized to other dates or combinations.",
        }

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
            "note": "Complete Jaya/Apes lookup matrix has not yet been recovered. No value is inferred from observed cases.",
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
