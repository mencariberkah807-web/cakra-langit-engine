from datetime import date

SOURCE_ID = "SSOT-PARIRIMBON-JABAR"
SOURCE_TITLE = "PARIRIMBON SUNDA (JAWA BARAT).pdf"

PANCAKA_4 = {
    1: {"name": "Sri", "meaning": "bagus", "context": "rizki"},
    2: {"name": "Kala", "meaning": "jelek", "context": "segala pekerjaan akan apes"},
    3: {"name": "Naga", "meaning": "bagus", "context": "mulai menuai / dapat menyimpan rizki"},
    0: {"name": "Numpi", "meaning": "bagus", "context": "menyimpan padi / diam, tidak banyak pengeluaran"},
}


def calculate_pertanian(target_date: date, activity: str = "tanam"):
    remainder = target_date.day % 4
    result = PANCAKA_4[remainder]

    return {
        "date": target_date.isoformat(),
        "activity": activity,
        "pancaka_4": {
            "input_day_of_month": target_date.day,
            "divisor": 4,
            "remainder": remainder,
            "result": result["name"],
            "meaning": result["meaning"],
            "context": result["context"],
            "source": {
                "source_id": SOURCE_ID,
                "source_title": SOURCE_TITLE,
                "location": "naskah p.80",
            },
        },
        "meta": {
            "status": "IMPLEMENTED",
            "note": "Pancaka 4 dipisahkan sebagai rule pertanian/task; interpretasi mengikuti konteks yang didukung sumber.",
        },
    }
