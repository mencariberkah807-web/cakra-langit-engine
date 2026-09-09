from engines.ingkel_engine import get_ingkel


def test_ingkel_cycle_is_six():
    values = [get_ingkel(index)["ingkelIndex"] for index in range(30)]
    assert values[:6] == [0, 1, 2, 3, 4, 5]
    assert values[6:12] == [0, 1, 2, 3, 4, 5]


def test_ingkel_reference_names():
    values = [get_ingkel(index)["ingkel"] for index in range(6)]
    assert values == ["Wong", "Sato", "Mina", "Manuk", "Taru", "Buku"]
