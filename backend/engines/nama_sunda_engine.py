SOURCE_ID = "SSOT-PARIRIMBON-JABAR"
SOURCE_TITLE = "PARIRIMBON SUNDA (JAWA BARAT).pdf"

# Only values explicitly validated in the current source set.
VALIDATED_SEGMENT_NAKTU = {
    "wi": 9,
    "kan": 5,
    "ta": 7,
    "wa": 9,
    "ya": 14,
}


def calculate_naktu_nama(name: str):
    clean = " ".join(name.strip().split())
    if not clean:
        raise ValueError("Nama diperlukan")

    segments = [part.lower() for part in clean.split(" ")]
    values = []
    unknown = []

    for segment in segments:
        value = VALIDATED_SEGMENT_NAKTU.get(segment)
        if value is None:
            unknown.append(segment)
        else:
            values.append({"segment": segment, "naktu": value})

    total = sum(item["naktu"] for item in values)

    return {
        "name": clean,
        "segments": segments,
        "naktu": values,
        "total": total if not unknown else None,
        "status": "VERIFIED" if not unknown else "PARTIAL_DATASET",
        "unknown_segments": unknown,
        "source": {
            "source_id": SOURCE_ID,
            "source_title": SOURCE_TITLE,
        },
        "note": "Dataset produksi lengkap belum tersedia di source set; nilai yang tidak tervalidasi tidak ditebak.",
    }
