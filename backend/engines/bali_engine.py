from datetime import date, datetime, timezone


DAY_MS = 24 * 60 * 60 * 1000

PAWUKON_CYCLE = 210

PAWUKON_ANCHOR_DATE = date(2000, 1, 18)
PAWUKON_ANCHOR_DAY = 86

SAPTAWARA = [
    "Redite",
    "Soma",
    "Anggara",
    "Buda",
    "Wraspati",
    "Sukra",
    "Saniscara",
]

SAPTAWARA_KERTA_AJI = [6, 4, 3, 6, 5, 7, 8]

PANCAWARA = [
    "Umanis",
    "Paing",
    "Pon",
    "Wage",
    "Kliwon",
]

PANCAWARA_URIP = [5, 9, 7, 4, 8]

PANCA_SUDHA = [
    "Wisesa Segara",
    "Tunggak Semi",
    "Satria Wibhawa",
    "Sumur Sinaba",
    "Bumi Kapetak",
    "Satria Wirang",
    "Lebu Katiup Angin",
]

WUKU = [
    "Sinta",
    "Landep",
    "Ukir",
    "Kulantir",
    "Tolu",
    "Gumbreg",
    "Wariga",
    "Warigadian",
    "Julungwangi",
    "Sungsang",
    "Dungulan",
    "Kuningan",
    "Langkir",
    "Medangsia",
    "Pujut",
    "Pahang",
    "Krulut",
    "Merakih",
    "Tambir",
    "Medangkungan",
    "Matal",
    "Uye",
    "Menail",
    "Prangbakat",
    "Bala",
    "Ugu",
    "Wayang",
    "Kelawu",
    "Dukut",
    "Watugunung",
]

LINTANG = [
    "Gajah",
    "Kiriman",
    "Jong Sarat",
    "Atiwa-tiwa",
    "Sangka Tikel",
    "Bubu Bolong",
    "Sugenge",
    "Uluku",
    "Pedati",
    "Kuda",
    "Gajah Mina",
    "Bade",
    "Magelut",
    "Pagelangan",
    "Kala Sungsang",
    "Kukus",
    "Asu",
    "Kartika",
    "Naga",
    "Banak Angerem",
    "Hru",
    "Patrem",
    "Lembu",
    "Depat",
    "Tangis",
    "Salah Ukur",
    "Perahu Pegat",
    "Puwuh Atarung",
    "Lawean",
    "Kelapa",
    "Yuyu",
    "Lumbung",
    "Kumbha",
    "Udang",
    "Begoong",
]


def mod(value, divisor):
    return ((value % divisor) + divisor) % divisor


def get_day_offset(target_date):
    return (target_date - PAWUKON_ANCHOR_DATE).days


def get_pawukon_day(target_date):
    offset = get_day_offset(target_date)

    return mod(
        PAWUKON_ANCHOR_DAY + offset,
        PAWUKON_CYCLE,
    )


def get_bali_calendar(target_date):
    if isinstance(target_date, datetime):
        if target_date.tzinfo is not None:
            target_date = target_date.astimezone(timezone.utc).date()
        else:
            target_date = target_date.date()

    pawukon_day = get_pawukon_day(target_date)

    wuku_index = pawukon_day // 7
    day_in_wuku_index = mod(pawukon_day, 7)

    saptawara_index = mod(pawukon_day, 7)
    pancawara_index = mod(pawukon_day, 5)
    lintang_index = mod(pawukon_day, 35)
    panca_sudha_index = mod(
        SAPTAWARA_KERTA_AJI[saptawara_index] + PANCAWARA_URIP[pancawara_index],
        7,
    )

    return {
        "saptawara": SAPTAWARA[saptawara_index],
        "pancawara": PANCAWARA[pancawara_index],
        "wuku": WUKU[wuku_index],
        "dayInWuku": day_in_wuku_index + 1,
        "pawukonDay": pawukon_day,
        "lintang": LINTANG[lintang_index],
        "lintangIndex": lintang_index,
        "pancaSudha": PANCA_SUDHA[panca_sudha_index],
        "pancaSudhaIndex": panca_sudha_index,
        "effectiveDate": target_date.isoformat(),
        "boundary": "MIDNIGHT",
        "meta": {
            "engine": "Bali Pawukon",
            "phase": "SOURCE_PORTED",
            "cycle": PAWUKON_CYCLE,
            "anchor": {
                "date": PAWUKON_ANCHOR_DATE.isoformat(),
                "pawukonDay": PAWUKON_ANCHOR_DAY,
            },
            "wukuIndex": wuku_index,
            "saptawaraIndex": saptawara_index,
            "pancawaraIndex": pancawara_index,
            "lintangIndex": lintang_index,
            "lintangCycle": 35,
            "lintangMethod": "Pawukon day modulo 35",
            "pancaSudhaIndex": panca_sudha_index,
            "pancaSudhaMethod": "(SaptaWara Kerta Aji + PancaWara Urip) modulo 7",
        },
    }
