from engines.rakam_engine import get_rakam


def test_rakam_reference_formula():
    result = get_rakam(0, 0)
    assert result["rakamIndex"] == 3
    assert result["rakam"] == "Mantri Sinaroja"


def test_rakam_cycle_is_six():
    values = [get_rakam(s, p)["rakamIndex"] for s in range(7) for p in range(5)]
    assert all(0 <= value < 6 for value in values)
