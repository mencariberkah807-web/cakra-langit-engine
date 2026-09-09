from engines.jejepan_engine import get_jejepan


def test_jejepan_reference_cycle():
    expected = ["Paksi", "Mina", "Taru", "Sato", "Patra", "Wong"]
    assert [get_jejepan(i)["jejepan"] for i in range(6)] == expected


def test_jejepan_index_is_modulo_six():
    assert get_jejepan(6)["jejepanIndex"] == 0
    assert get_jejepan(11)["jejepanIndex"] == 5
