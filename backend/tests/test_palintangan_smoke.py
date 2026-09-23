from datetime import date

from engines.arah_sunda_engine import calculate_arah
from engines.jaya_apes_sunda_engine import calculate_jaya_apes
from engines.jodoh_sunda_engine import calculate_repak_jodoh
from engines.kelahiran_sunda_engine import calculate_kelahiran
from engines.nama_sunda_engine import calculate_naktu_nama
from engines.pancaka12_sunda_engine import calculate_pancaka_12
from engines.pertanian_sunda_engine import calculate_pertanian
from engines.palintangan_sunda_engine import calculate_palintangan
from engines.waktu_sunda_engine import calculate_waktu


def test_daily_global():
    result = calculate_palintangan(date(2026, 9, 23))
    assert result["calendar"]["day"]
    assert result["calendar"]["pasaran"]
    assert result["naktu"]["wedal"] is not None
    assert result["monthly_rule"]["rizki_direction"]


def test_pertanian():
    result = calculate_pertanian(date(2026, 9, 23), "panen")
    assert result["pancaka_4"]["result"] in {"Sri", "Kala", "Naga", "Numpi"}


def test_waktu_verified_case():
    result = calculate_waktu("Ahad", "09:00")
    assert result["result"] == "BAIK"


def test_arah():
    result = calculate_arah(date(2026, 9, 23))
    assert result["direction"]["rizki"]


def test_kelahiran():
    result = calculate_kelahiran(date(1984, 1, 11))
    assert result["calendar"]["day"]
    assert result["naktu"]["wedal"] is not None
    assert result["calculation_trace"]


def test_nama():
    result = calculate_naktu_nama("Fareza", system="cacarakan_18")
    assert result["total"] is not None


def test_pancaka_12():
    result = calculate_pancaka_12("Pedro", "ba ra ha ma")
    assert result["status"] == "VERIFIED"
    assert result["nabi"]


def test_jodoh():
    result = calculate_repak_jodoh(21, 55)
    assert result["pancaka_7"]["result"]


def test_personal_jaya_apes_baseline():
    result = calculate_jaya_apes("Senin", "Pahing", 12)
    assert result["jaya"] == "Saptu"
    assert result["apes"] == "Kemis"
