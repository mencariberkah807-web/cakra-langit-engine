from datetime import date


WULAN = [
    "Sura", "Sapar", "Mulud", "Bakdamulud",
    "Jumadilawal", "Jumadilakir", "Rejeb", "Ruwah",
    "Pasa", "Sawal", "Dulkangidah", "Besar",
]

TAUN = [
    "Alip", "Ehe", "Jimawal", "Je",
    "Dal", "Be", "Wawu", "Jimakir",
]

PAS = ["Pon", "Wage", "Kliwon", "Legi", "Pahing"]

MINGGU = [
    "Senen", "Selasa", "Rebo", "Kemis",
    "Jemuwah", "Setu", "Ngahad",
]

WUKU = [
    "Sinta", "Landep", "Wukir", "Kurantil", "Tolu",
    "Gumbreg", "Warigalit", "Warigagung", "Julungwangi",
    "Sungsang", "Galungan", "Kuningan", "Langkir", "Mandasiya",
    "Julungpujut", "Pahang", "Kuruwelut", "Marakeh", "Tambir",
    "Medangkungan", "Maktal", "Wuye", "Manahil", "Prangbakat",
    "Bala", "Wugu", "Wayang", "Kulawu", "Dukut", "Watugunung",
]

WINDU = ["Adi", "Kuntara", "Sengara", "Sancaya"]
LAMBANG = ["Langkir", "Kulawu"]

KURUP = [
    ["Jamingiyah", "A'ahgi", 1555, 0],
    ["Kamsiyah", "Amiswon", 1675, 0],
    ["Arbangiyah", "Aboge", 1749, 2],
    ["Salasiyah", "Asapon", 1867, 0],
]

ORIGIN = date(1633, 7, 8)


def mod(a, b):
    return ((a % b) + b) % b


def month_sum(months):
    return sum(months)


def build_wt(max_year=2200):
    w354 = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29]
    w355 = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30]
    wtd1 = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30]
    wtd2 = [30, 30, 29, 29, 30, 29, 30, 29, 30, 29, 30, 30]
    wtd3 = [30, 30, 29, 29, 29, 29, 30, 29, 30, 29, 30, 30]
    wtd4 = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29]

    years = []

    for y in range(1555, max_year + 1):
        k = -1

        for i, row in enumerate(KURUP):
            if y >= row[2] and (
                i == len(KURUP) - 1 or y < KURUP[i + 1][2]
            ):
                k = i
                break

        if k < 0:
            k = len(KURUP) - 1

        pos = mod(y - 1555, 8)

        if pos == 4:
            months = [wtd1, wtd2, wtd3, wtd4][min(k, 3)]
        elif pos in (1, 7):
            months = w355
        elif pos == 3 and k >= 2:
            months = w355
        else:
            months = w354

        years.append({
            "y": y,
            "months": list(months),
            "k": k,
        })

    for i in range(len(KURUP)):
        end = (
            KURUP[i + 1][2] - 1
            if i < len(KURUP) - 1
            else KURUP[i][2] + 119
        )

        record = next(
            (year for year in years if year["y"] == end),
            None,
        )

        if record:
            record["months"][11] -= 1

    return years


YEARS = build_wt()


def jawa_from_gregorian(y, m, d):
    target = date(y, m, d)

    if target < ORIGIN:
        raise ValueError(
            "Tanggal sebelum 8 Juli 1633 tidak didukung."
        )

    dti = (target - ORIGIN).days + 1
    remain = dti
    record = None

    for year in YEARS:
        total = month_sum(year["months"])

        if remain <= total:
            record = year
            break

        remain -= total

    if record is None:
        raise ValueError("Tanggal di luar rentang engine.")

    month_index = 0

    while remain > record["months"][month_index]:
        remain -= record["months"][month_index]
        month_index += 1

    day = remain
    year_index = mod(record["y"] - 1555, 8)

    serial = (target - date(1970, 1, 1)).days
    utc_weekday = (target.weekday() + 1) % 7

    day_name = MINGGU[utc_weekday - 1] if utc_weekday > 0 else MINGGU[6]

    pasaran = PAS[mod(serial + 1, 5)]

    pawukon_day = mod(
        (target - date(2000, 1, 1)).days + 68,
        210,
    ) + 1

    wuku = WUKU[(pawukon_day - 1) // 7]

    kurup_index = -1

    for i, row in enumerate(KURUP):
        if record["y"] >= row[2] and (
            i == len(KURUP) - 1 or record["y"] < KURUP[i + 1][2]
        ):
            kurup_index = i
            break

    windu_index = mod(((record["y"] - 1555) // 8) + 1, 4)

    return {
        "day": day,
        "month": month_index + 1,
        "monthName": WULAN[month_index],
        "year": record["y"],
        "yearName": TAUN[year_index],
        "dayName": day_name,
        "pasaran": pasaran,
        "weton": f"{day_name} {pasaran}",
        "wuku": wuku,
        "windu": WINDU[windu_index],
        "lambang": LAMBANG[mod(windu_index, 2)],
        "kurup": KURUP[
            kurup_index if kurup_index >= 0 else len(KURUP) - 1
        ][0],
        "pawukonDay": pawukon_day,
    }


def get_jawa_data(target_date):
    result = jawa_from_gregorian(
        target_date.year,
        target_date.month,
        target_date.day,
    )

    return {
        **result,
        "effectiveDate": target_date.isoformat(),
        "meta": {
            "engine": "Jawa",
            "phase": "SOURCE_COMPILED",
        },
    }
