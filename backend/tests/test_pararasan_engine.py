from engines.pararasan_engine import get_pararasan_variants


def test_pararasan_variants_are_explicitly_separated():
    variants = get_pararasan_variants()
    assert variants["babad_bali_10"]["cycle"] == 10
    assert variants["sakacalendar_12"]["cycle"] == 12
    assert len(variants["babad_bali_10"]["values"]) == 10
    assert len(variants["sakacalendar_12"]["values"]) == 12
