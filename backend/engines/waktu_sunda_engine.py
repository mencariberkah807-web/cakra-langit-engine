SOURCE_ID = "SSOT-PARIRIMBON-JABAR"
SOURCE_TITLE = "PARIRIMBON SUNDA (JAWA BARAT).pdf"

def calculate_waktu(day_name: str, time_value: str):
    verified = day_name in ("Ahad", "Ngahad", "Minggu") and time_value == "09:00"
    return {
        "day": day_name,
        "time": time_value,
        "status": "VERIFIED_TEST_CASE" if verified else "PARTIAL_SOURCE",
        "result": "BAIK" if verified else None,
        "source": {
            "source_id": SOURCE_ID,
            "source_title": SOURCE_TITLE,
            "location": "p.73",
        },
        "note": "PDF memuat contoh Minggu pukul 09.00 = baik. Interval Watek Jam lengkap belum recovered; hasil lain tidak diinferensikan.",
    }
