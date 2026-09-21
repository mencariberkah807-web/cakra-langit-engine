SOURCE_ID = "SSOT-PARIRIMBON-JABAR"
SOURCE_TITLE = "PARIRIMBON SUNDA (JAWA BARAT).pdf"

PANCAKA_7_RESULTS = {
    1: "Pisang Punggel",
    2: "Tunggak Semi",
    3: "Lungguh Gumuling",
    4: "Satriya Lumaku",
    5: "Pandita Mukti",
    6: "Pandan Waringin",
    7: "Padaringan Kebek",
}


def calculate_repak_jodoh(naktu_nama_one: int, naktu_nama_two: int):
    if naktu_nama_one is None or naktu_nama_two is None:
        raise ValueError("Dua input Naktu nama diperlukan")

    total = naktu_nama_one + naktu_nama_two
    remainder = total % 7
    result_index = 7 if remainder == 0 else remainder

    return {
        "naktu_nama": {
            "one": naktu_nama_one,
            "two": naktu_nama_two,
            "total": total,
        },
        "pancaka_7": {
            "divisor": 7,
            "remainder": remainder,
            "result_index": result_index,
            "result": PANCAKA_7_RESULTS[result_index],
            "context": "Repok/Jodoh",
            "source": {
                "source_id": SOURCE_ID,
                "source_title": SOURCE_TITLE,
                "location": "Master Matrix / Pancaka 7",
            },
        },
        "meta": {
            "status": "IMPLEMENTED",
            "note": "Engine menerima hasil Naktu nama sebagai input; pemetaan huruf/nama ke Naktu tetap menjadi dependency terpisah.",
        },
    }
