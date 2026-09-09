INGKEL = [
    "Wong",
    "Sato",
    "Mina",
    "Manuk",
    "Taru",
    "Buku",
]


def get_ingkel(wuku_index):
    index = wuku_index % 6
    return {
        "ingkel": INGKEL[index],
        "ingkelIndex": index,
        "method": "Wuku index modulo 6",
    }
