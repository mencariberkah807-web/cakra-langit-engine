# Javanese partner/weton calculations.
#
# The existing Wolu (mod 8) calculation is preserved for backward compatibility.
# Supplementary petungan are sourced from public/open implementations:
# - dimasim/Kalkulator-Weton-App (Petung dibagi 4/5/7/8)
# - arekgresikid/primbon-jawa (cross-reference for the same petungan family)
#
# Sources:
# https://github.com/dimasim/Kalkulator-Weton-App
# https://github.com/arekgresikid/primbon-jawa

PETUNGAN_PITU = {
    1: {"name": "Wasesa Segara", "meaning": "Pasangan ini bersifat pemaaf, rendah hati, penuh wibawa, dan memiliki visi pernikahan yang luas."},
    2: {"name": "Tunggak Semi", "meaning": "Memiliki kemampuan mendulang rezeki, namun berisiko mengalami masalah kesehatan."},
    3: {"name": "Satriya Wibawa", "meaning": "Akan dianugerahi rezeki yang melimpah dan menciptakan kehidupan yang sejahtera."},
    4: {"name": "Sumur Sinaba", "meaning": "Menjadi teladan bagi banyak pasangan dan rumah tangganya penuh ilmu."},
    5: {"name": "Satria Wirang", "meaning": "Mungkin menghadapi cobaan dan kekurangan finansial dalam pernikahan."},
    6: {"name": "Bumi Kepetak", "meaning": "Orang yang tertutup tetapi gigih bekerja dan solid dalam menghadapi kesulitan."},
    7: {"name": "Lebu Ketiyup Angin", "meaning": "Cita-cita sulit terkabul dan ketidakpastian mengitari kehidupan mereka."},
}

PETUNGAN_PAPAT = {
    1: {"name": "Ganthi", "meaning": "Akan sulit memiliki keturunan."},
    2: {"name": "Gembili", "meaning": "Akan dikaruniai banyak keturunan."},
    3: {"name": "Sri", "meaning": "Akan memiliki rejeki yang melimpah."},
    4: {"name": "Punggel", "meaning": "Salah satu akan meninggal dunia."},
}

PETUNGAN_LIMA = {
    1: {"name": "Sri", "meaning": "Memiliki rejeki yang melimpah."},
    2: {"name": "Dhana", "meaning": "Akan menjadi kaya raya."},
    3: {"name": "Lara", "meaning": "Akan mengalami banyak penyakit."},
    4: {"name": "Pati", "meaning": "Salah satu akan meninggal dunia."},
    5: {"name": "Lungguh", "meaning": "Akan memiliki jabatan atau pangkat."},
}

JODOH_RESULTS = {
    1: {"name": "Pegat", "meaning": "Pasangan yang masuk kategori Pegat akan banyak menemui masalah, seperti kesulitan ekonomi, komunikasi yang kurang baik, atau perselingkuhan, sehingga rawan terjadi perceraian."},
    2: {"name": "Ratu", "meaning": "Pasangan yang masuk kategori Ratu akan disegani banyak orang dan dikenal karena keharmonisannya."},
    3: {"name": "Jodoh", "meaning": "Pasangan yang masuk kategori Jodoh cenderung harmonis, saling menerima kelebihan dan kekurangan, dan langgeng sampai tua."},
    4: {"name": "Topo", "meaning": "Pada awal kehidupan rumah tangga dapat banyak mengalami kesulitan, terutama ekonomi, namun seiring waktu kehidupan dapat membaik."},
    5: {"name": "Tinari", "meaning": "Kehidupan rumah tangga banyak menemui kesenangan, keberuntungan, dan kemudahan mencari rezeki."},
    6: {"name": "Padu", "meaning": "Kehidupan rumah tangga dapat sering mengalami konflik, pertengkaran, atau beda pendapat, tetapi tidak sampai terjadi perceraian."},
    7: {"name": "Sujanan", "meaning": "Kehidupan rumah tangga dapat sering bertengkar, tidak harmonis, dan rawan perselingkuhan."},
    8: {"name": "Pesthi", "meaning": "Kehidupan rumah tangga dikaitkan dengan kedamaian, kerukunan, dan ketenteraman."},
}


def _remainder(total, divisor):
    return total % divisor or divisor


def _petungan(total, divisor, table):
    remainder = _remainder(total, divisor)
    result = table[remainder]
    return {
        "divisor": divisor,
        "remainder": remainder,
        "name": result["name"],
        "meaning": result["meaning"],
        "method": f"Total Neptu pasangan modulo {divisor}; sisa 0 dibaca sebagai sisa {divisor}.",
    }


def get_jodoh(neptu_one, neptu_two):
    if not isinstance(neptu_one, int) or not isinstance(neptu_two, int):
        raise ValueError("Neptu pasangan harus berupa bilangan bulat.")
    if neptu_one <= 0 or neptu_two <= 0:
        raise ValueError("Neptu pasangan harus lebih besar dari nol.")

    total = neptu_one + neptu_two
    pitu = _petungan(total, 7, PETUNGAN_PITU)
    papat = _petungan(total, 4, PETUNGAN_PAPAT)
    lima = _petungan(total, 5, PETUNGAN_LIMA)
    wolu = _petungan(total, 8, JODOH_RESULTS)

    return {
        "neptu_one": neptu_one,
        "neptu_two": neptu_two,
        "total_neptu": total,
        "remainder": wolu["remainder"],
        "name": wolu["name"],
        "meaning": wolu["meaning"],
        "method": wolu["method"],
        "status": "TRADITIONAL_REFERENCE",
        "petungan": {
            "pitu": pitu,
            "papat": papat,
            "lima": lima,
            "wolu": wolu,
        },
        "sources": [
            "https://github.com/dimasim/Kalkulator-Weton-App",
            "https://github.com/arekgresikid/primbon-jawa",
        ],
    }
