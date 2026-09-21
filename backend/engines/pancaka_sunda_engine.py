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

PANCAKA_12_RESULTS = {i: None for i in range(1, 13)}


def pancaka_7_from_naktu(total_naktu: int):
    if total_naktu is None:
        return None
    remainder = total_naktu % 7
    result_index = 7 if remainder == 0 else remainder
    return {
        "input_naktu": total_naktu,
        "divisor": 7,
        "remainder": remainder,
        "result_index": result_index,
        "result": PANCAKA_7_RESULTS[result_index],
        "context": "Repok/Jodoh",
        "source": {"source_id": SOURCE_ID, "source_title": SOURCE_TITLE},
    }


def pancaka_12_from_naktu(total_naktu: int):
    if total_naktu is None:
        return None
    remainder = total_naktu % 12
    result_index = 12 if remainder == 0 else remainder
    return {
        "input_naktu": total_naktu,
        "divisor": 12,
        "remainder": remainder,
        "result_index": result_index,
        "result": PANCAKA_12_RESULTS[result_index],
        "result_index_only": True,
        "note": "Sumber yang tersedia memverifikasi pembagian menjadi 12 kategori Nabi, tetapi nama Nabi per indeks belum tersedia dalam matrix.",
        "context": "Watak nama",
        "source": {"source_id": SOURCE_ID, "source_title": SOURCE_TITLE},
    }
