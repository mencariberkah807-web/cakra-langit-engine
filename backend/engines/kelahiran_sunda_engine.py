from datetime import date

from engines.palintangan_sunda_engine import calculate_palintangan
from engines.jaya_apes_sunda_engine import calculate_jaya_apes


SOURCE_ID = "SSOT-PARIRIMBON-JABAR"
SOURCE_TITLE = "PARIRIMBON SUNDA (JAWA BARAT).pdf"

HOUSE_DIRECTION_VERIFIED = {
    "Sabtu": "Utara",
    "Setu": "Utara",
    "Minggu": "Timur",
    "Ahad": "Timur",
    "Selasa": "Utara",
    "Kamis": "Timur",
    "Kemis": "Timur",
}

BIRTH_DOA = {
    "Ahad": {"dua": "ya hayu ya kayumu", "count": 500},
    "Minggu": {"dua": "ya hayu ya kayumu", "count": 500},
    "Senen": {"dua": "ya rahmanu ya rahimu", "count": 400},
    "Senin": {"dua": "ya rahmanu ya rahimu", "count": 400},
    "Selasa": {"dua": "ya malikul qudus", "count": 300},
    "Rebo": {"dua": "ya basiru ya mutaha", "count": 700},
    "Rabu": {"dua": "ya basiru ya mutaha", "count": 700},
    "Kemis": {"dua": "ya alliyu ya adimu", "count": 800},
    "Kamis": {"dua": "ya alliyu ya adimu", "count": 800},
    "Jumaah": {"dua": "ya kapi ya mugaeni", "count": 600},
    "Jumat": {"dua": "ya kapi ya mugaeni", "count": 600},
    "Jemuwah": {"dua": "ya kapi ya mugaeni", "count": 600},
    "Setu": {"dua": "ya pattahu ya rajaku", "count": 900},
    "Sabtu": {"dua": "ya pattahu ya rajaku", "count": 900},
}



def calculate_kelahiran(target_date: date, timezone_name: str = "Asia/Jakarta"):
    daily = calculate_palintangan(target_date, timezone_name)
    jaya_apes = calculate_jaya_apes(daily["calendar"]["day"], daily["calendar"]["pasaran"], daily["naktu"]["wedal"])
    birth_date = target_date.isoformat()
    day_name = daily["calendar"]["day"]
    pasaran = daily["calendar"]["pasaran"]
    naktu = daily["naktu"]
    watek = daily["watek"]
    birth_context = daily["birth_context"]
    house_direction = HOUSE_DIRECTION_VERIFIED.get(day_name)
    doa = BIRTH_DOA.get(day_name, {})
    jaya_apes = calculate_jaya_apes(day_name, pasaran, naktu["wedal"])

    # Audit trace: every production birth rule exposes Source + Input +
    # Transform + Output + Context + Status. Missing source data is explicit.
    calculation_trace = [
        {
            "rule_id": "CAL-001",
            "rule": "Calendar birth context",
            "input": {"date": birth_date, "timezone": timezone_name},
            "transform": "calendar engine lookup/calculation",
            "output": daily["calendar"],
            "context": "PERSONAL / KELAHIRAN",
            "status": "IMPLEMENTED",
            "source": {"source_id": SOURCE_ID, "source_title": SOURCE_TITLE},
        },
        {
            "rule_id": "NKT-001..005",
            "rule": "Four Naktu + Naktu Wedal",
            "input": {"day": day_name, "pasaran": pasaran, "month": naktu.get("bulan"), "year": naktu.get("tahun")},
            "transform": "lookup Naktu Hari/Pasaran/Bulan/Tahun; Wedal = Naktu Hari + Naktu Pasaran",
            "output": naktu,
            "context": "PERSONAL / KELAHIRAN",
            "status": naktu.get("four_component_status", "IMPLEMENTED"),
            "source": {"source_id": SOURCE_ID, "source_title": SOURCE_TITLE},
        },
        {
            "rule_id": "BAB-001",
            "rule": "Watek berdasarkan hari lahir",
            "input": {"day": day_name},
            "transform": "lookup watek hari",
            "output": watek,
            "context": "PERSONAL / KELAHIRAN",
            "status": "SOURCE_DATA",
            "source": watek.get("source", {"source_id": SOURCE_ID, "source_title": SOURCE_TITLE}),
        },
        {
            "rule_id": "BAB-003",
            "rule": "Arah Naga",
            "input": {"day": day_name},
            "transform": "lookup arah Naga menurut hari lahir",
            "output": birth_context,
            "context": "PERSONAL / KELAHIRAN",
            "status": birth_context.get("status", "SOURCE_DATA"),
            "source": birth_context.get("source", {"source_id": SOURCE_ID, "source_title": SOURCE_TITLE}),
        },
        {
            "rule_id": "BAB-004",
            "rule": "Rumah",
            "input": {"day": day_name},
            "transform": "lookup arah rumah berdasarkan hari yang tersedia pada source",
            "output": {"direction": house_direction},
            "context": "PERSONAL / KELAHIRAN",
            "status": "VERIFIED_DATA" if house_direction else "PARTIAL_SOURCE",
            "source": {"source_id": SOURCE_ID, "source_title": SOURCE_TITLE, "location": "naskah p.90"},
        },
        {
            "rule_id": "BAB-002",
            "rule": "Doa hari kelahiran",
            "input": {"day": day_name, "naktu_hari": naktu.get("hari")},
            "transform": "lookup doa; count = Naktu Hari × 100",
            "output": doa,
            "context": "PERSONAL / KELAHIRAN",
            "status": "SOURCE_DATA" if doa else "PARTIAL_SOURCE",
            "source": {"source_id": SOURCE_ID, "source_title": SOURCE_TITLE, "location": "naskah p.89"},
        },
        {
            "rule_id": "GAG-001",
            "rule": "Gagalang",
            "input": {"pasaran": pasaran},
            "transform": "lookup Gagalang berdasarkan pasaran",
            "output": daily["gagalang"],
            "context": "PERSONAL / KELAHIRAN",
            "status": "SOURCE_DATA",
            "source": daily["gagalang"].get("source", {"source_id": SOURCE_ID, "source_title": SOURCE_TITLE}),
        },
        {
            "rule_id": "JYA-001..003",
            "rule": "Jaya / Apes",
            "input": {"day": day_name, "pasaran": pasaran, "wedal": naktu.get("wedal")},
            "transform": "lookup validated Jaya/Apes matrix; no inference for missing rows",
            "output": jaya_apes,
            "context": "PERSONAL / KELAHIRAN",
            "status": jaya_apes.get("status", "PARTIAL_DATASET"),
            "source": jaya_apes.get("source", {"source_id": SOURCE_ID, "source_title": SOURCE_TITLE}),
        },
        {
            "rule_id": "NAS-001",
            "rule": "Pernaasan date context",
            "input": {"hijri": daily["calendar"].get("hijri")},
            "transform": "lookup three source dates for Hijri month; no formation formula inferred",
            "output": daily.get("pernaasan"),
            "context": "GLOBAL REFERENCE / BIRTH DATE",
            "status": "DATA_ONLY",
            "source": {"source_id": SOURCE_ID, "source_title": SOURCE_TITLE},
        },
    ]

    return {
        "birth_date": birth_date,
        "input_context": {
            "date": birth_date,
            "timezone": timezone_name,
            "time_used": False,
            "note": "Current Kelahiran rules in this engine are date/day based; birth time is not used unless a source rule explicitly requires it.",
        },
        "calendar": daily["calendar"],
        "naktu": naktu,
        "watek": watek,
        "birth_context": birth_context,
        "birth_house_direction": {
            "direction": house_direction,
            "status": "PARTIAL_SOURCE" if house_direction is None else "VERIFIED_DATA",
            "source": {"source_id": SOURCE_ID, "source_title": SOURCE_TITLE, "location": "naskah p.90"},
            "note": "Hanya hari yang eksplisit terbaca pada source yang diisi; hari lain tidak diinferensikan.",
        },
        "birth_doa": {
            **doa,
            "count_basis": "naktu hari × 100" if naktu["hari"] is not None else None,
            "count_check": (doa.get("count") == naktu["hari"] * 100) if naktu["hari"] is not None and doa else None,
            "source": {"source_id": SOURCE_ID, "source_title": SOURCE_TITLE, "location": "naskah p.89"},
        },
        "gagalang": daily["gagalang"],
        "jaya_apes": jaya_apes,
        "pernaasan": daily.get("pernaasan"),
        "monthly_rule": daily["monthly_rule"],
        "calculation_trace": calculation_trace,
        "meta": {
            "status": "IMPLEMENTED_BASE_LAYER",
            "source_id": SOURCE_ID,
            "source_title": SOURCE_TITLE,
            "note": "Kelahiran memakai calendar context dan Naktu/Watek yang sudah tervalidasi. Tafsir personal tambahan belum ditambahkan tanpa source rule yang eksplisit.",
        },
    }
