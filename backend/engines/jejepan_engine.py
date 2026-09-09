JEJEPAN = [
    "Mina",
    "Taru",
    "Sato",
    "Patra",
    "Wong",
    "Paksi",
]


def get_jejepan(pawukon_day):
    index = pawukon_day % 6
    return {
        "jejepan": JEJEPAN[index],
        "jejepanIndex": index,
        "method": "Pawukon day modulo 6",
    }
