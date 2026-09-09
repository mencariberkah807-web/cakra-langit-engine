RAKAM = [
    "Kala Tinatang",
    "Demang Kandhuruwan",
    "Sanggar Waringin",
    "Mantri Sinaroja",
    "Macam Katawan",
    "Nuju Pati",
]

SAPTAWARA_KUPIH = [3, 4, 5, 6, 7, 1, 2]
PANCAWARA_KUPIH = [0, 1, 2, 3, 4]


def get_rakam(saptawara_index, pancawara_index):
    index = (SAPTAWARA_KUPIH[saptawara_index] + PANCAWARA_KUPIH[pancawara_index]) % 6
    return {
        "rakam": RAKAM[index],
        "rakamIndex": index,
        "method": "(SaptaWara Kupih + PancaWara Kupih) modulo 6",
    }
