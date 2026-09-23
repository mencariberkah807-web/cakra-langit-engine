from datetime import date


SOURCE_ID = "RESEARCH-KALA-IDER-SUNDA"
SOURCE_TITLE = "Kala Ider / daftar hari baik Kalender Sunda"

# These are documented date -> result observations. They are preserved as
# source data and are NOT generalized into a formula or complete matrix.
KALA_IDER_RESEARCH_CASES = {
    # External research source: MCKN Pajajaran–Sumedang Larang, 2019.
    "2019-10-28": {
        "day": "Senen", "pasaran": "Legi",
        "jaya": "Jaya Semah", "apes": "Manggih Harja",
        "source_id": "MCKN-CAKA-SUNDA-2019",
        "source_title": "Perhitungan Hari Baik Kalender Sunda",
        "source_scope": "external research / Kala Ider",
    },
    "2019-11-06": {
        "day": "Rebo", "pasaran": "Kliwon",
        "jaya": "Pada Jaya", "apes": "Manggih Harja",
        "source_id": "MCKN-CAKA-SUNDA-2019",
        "source_title": "Perhitungan Hari Baik Kalender Sunda",
        "source_scope": "external research / Kala Ider",
    },
    "2019-11-07": {
        "day": "Kemis", "pasaran": "Legi",
        "jaya": "Jaya Semah", "apes": "Manggih Harja",
        "source_id": "MCKN-CAKA-SUNDA-2019",
        "source_title": "Perhitungan Hari Baik Kalender Sunda",
        "source_scope": "external research / Kala Ider",
    },
    "2019-11-11": {
        "day": "Senen", "pasaran": "Kliwon",
        "jaya": "Jaya Semah", "apes": "Manggih Harja",
        "source_id": "MCKN-CAKA-SUNDA-2019",
        "source_title": "Perhitungan Hari Baik Kalender Sunda",
        "source_scope": "external research / Kala Ider",
    },
    "2019-11-16": {
        "day": "Saptu", "pasaran": "Kliwon",
        "jaya": "Jaya Pribumi", "apes": "Manggih Harja",
        "source_id": "MCKN-CAKA-SUNDA-2019",
        "source_title": "Perhitungan Hari Baik Kalender Sunda",
        "source_scope": "external research / Kala Ider",
    },
    "2019-11-26": {
        "day": "Selasa", "pasaran": "Pon",
        "jaya": "Pada Jaya", "apes": "Manggih Harja",
        "source_id": "MCKN-CAKA-SUNDA-2019",
        "source_title": "Perhitungan Hari Baik Kalender Sunda",
        "source_scope": "external research / Kala Ider",
    },
    "2019-12-03": {
        "day": "Selasa", "pasaran": "Legi",
        "jaya": "Jaya Semah", "apes": "Manggih Harja",
        "source_id": "MCKN-CAKA-SUNDA-2019",
        "source_title": "Perhitungan Hari Baik Kalender Sunda",
        "source_scope": "external research / Kala Ider",
    },
    "2019-12-05": {
        "day": "Kemis", "pasaran": "Wage",
        "jaya": "Jaya Semah", "apes": "Manggih Harja",
        "source_id": "MCKN-CAKA-SUNDA-2019",
        "source_title": "Perhitungan Hari Baik Kalender Sunda",
        "source_scope": "external research / Kala Ider",
    },
    "2019-12-08": {
        "day": "Ahad", "pasaran": "Kliwon",
        "jaya": "Jaya Pribumi", "apes": "Manggih Harja",
        "source_id": "MCKN-CAKA-SUNDA-2019",
        "source_title": "Perhitungan Hari Baik Kalender Sunda",
        "source_scope": "external research / Kala Ider",
    },
    "2019-12-10": {
        "day": "Selasa", "pasaran": "Wage",
        "jaya": "Pada Jaya", "apes": "Manggih Harja",
        "source_id": "MCKN-CAKA-SUNDA-2019",
        "source_title": "Perhitungan Hari Baik Kalender Sunda",
        "source_scope": "external research / Kala Ider",
    },
    "2019-12-18": {
        "day": "Rebo", "pasaran": "Kliwon",
        "jaya": "Pada Jaya", "apes": "Manggih Harja",
        "source_id": "MCKN-CAKA-SUNDA-2019",
        "source_title": "Perhitungan Hari Baik Kalender Sunda",
        "source_scope": "external research / Kala Ider",
    },
    "2019-12-23": {
        "day": "Senen", "pasaran": "Legi",
        "jaya": "Jaya Semah", "apes": "Manggih Harja",
        "source_id": "MCKN-CAKA-SUNDA-2019",
        "source_title": "Perhitungan Hari Baik Kalender Sunda",
        "source_scope": "external research / Kala Ider",
    },
    # Documented observations from the 2026 Palintangan research session.
    "2026-08-22": {
        "day": "Saptu", "pasaran": "Legi",
        "jaya": "Jaya Semah", "apes": "Manggih Harja",
        "source_id": "CHAT-RESEARCH-2026-08-28",
        "source_title": "Palintangan Sunda — hasil riset chat terdokumentasi",
        "source_scope": "documented research observation",
    },
    "2026-08-23": {
        "day": "Ahad", "pasaran": "Pahing",
        "jaya": "Pada Jaya", "apes": "Manggih Susah",
        "source_id": "CHAT-RESEARCH-2026-08-28",
        "source_title": "Palintangan Sunda — hasil riset chat terdokumentasi",
        "source_scope": "documented research observation",
    },
    "2026-08-24": {
        "day": "Senen", "pasaran": "Pon",
        "jaya": "Jaya Semah", "apes": "Manggih Pati",
        "source_id": "CHAT-RESEARCH-2026-08-28",
        "source_title": "Palintangan Sunda — hasil riset chat terdokumentasi",
        "source_scope": "documented research observation",
    },
    "2026-08-25": {
        "day": "Selasa", "pasaran": "Wage",
        "jaya": "Jaya Pribumi", "apes": "Manggih Wirang",
        "source_id": "CHAT-RESEARCH-2026-08-28",
        "source_title": "Palintangan Sunda — hasil riset chat terdokumentasi",
        "source_scope": "documented research observation",
    },
    "2026-08-26": {
        "day": "Rebo", "pasaran": "Kliwon",
        "jaya": "Pada Apes", "apes": "Manggih Harja",
        "source_id": "CHAT-RESEARCH-2026-08-28",
        "source_title": "Palintangan Sunda — hasil riset chat terdokumentasi",
        "source_scope": "documented research observation",
    },
    "2026-08-27": {
        "day": "Kemis", "pasaran": "Legi",
        "jaya": "Pada Jaya", "apes": "Manggih Harja",
        "source_id": "CHAT-RESEARCH-2026-08-28",
        "source_title": "Palintangan Sunda — hasil riset chat terdokumentasi",
        "source_scope": "documented research observation",
    },
}


def calculate_kala_ider(target_date: date, day_name: str, pasaran: str):
    item = KALA_IDER_RESEARCH_CASES.get(target_date.isoformat())
    if item is None:
        return {
            "status": "RESEARCH_DATASET_NOT_COVERING_DATE",
            "date": target_date.isoformat(),
            "day": day_name,
            "pasaran": pasaran,
            "jaya": None,
            "apes": None,
            "source": {
                "source_id": SOURCE_ID,
                "source_title": SOURCE_TITLE,
                "lineage": "documented date/result cases only; transformation rule and complete matrix not recovered",
            },
            "note": "Tidak ada nilai yang diinferensikan untuk tanggal yang belum terdokumentasi.",
        }

    return {
        "status": "VERIFIED_RESEARCH_CASE",
        "date": target_date.isoformat(),
        "day": item["day"],
        "pasaran": item["pasaran"],
        "jaya": item["jaya"],
        "apes": item["apes"],
        "source": {
            "source_id": item["source_id"],
            "source_title": item["source_title"],
            "scope": item["source_scope"],
            "lineage": "exact documented date/result observation; not generalized",
        },
        "note": "Hasil penelitian ditampilkan apa adanya. Belum dipakai untuk membentuk formula atau mengisi kombinasi yang belum terdokumentasi.",
    }
