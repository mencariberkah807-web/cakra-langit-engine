# Javanese partner/weton calculations.
#
# The existing Wolu (mod 8) calculation is preserved for backward compatibility.
# Additional petungan are sourced from public/open implementations and references:
# - dimasim/Kalkulator-Weton-App (Petung dibagi 4/7/8)
# - naufalist/weton (Wolu sequence)
# These are exposed as supplementary results; the existing `name` field remains
# the Wolu result so existing API consumers are not broken.

PETUNGAN_PITU = {
    1: {"name": "Wasesa Segara", "meaning": "Dikaitkan dengan sifat sabar, pemaaf, berbudi luhur, dan berwibawa."},
    2: {"name": "Tunggak Semi", "meaning": "Dikaitkan dengan rezeki yang mudah dan terus mengalir."},
    3: {"name": "Satriya Wibawa", "meaning": "Dikaitkan dengan kemuliaan, keluhuran, dan kewibawaan."},
    4: {"name": "Sumur Sinaba", "meaning": "Dikaitkan dengan menjadi tempat orang datang mencari ilmu atau teladan."},
    5: {"name": "Satria Wirang", "meaning": "Dikaitkan dengan cobaan, dukacita, dan kewirangan."},
    6: {"name": "Bumi Kepetak", "meaning": "Dikaitkan dengan ketabahan menghadapi kesulitan dan sifat pekerja keras."},
    7: {"name": "Lebu Katiup Angin", "meaning": "Dikaitkan dengan cita-cita yang tidak mudah tercapai dan kehidupan yang tidak menentu."},
}

PETUNGAN_PAPAT = {
    1: {"name": "Ganthi", "meaning": "Dikaitkan dengan kesulitan mendapatkan keturunan."},
    2: {"name": "Gembili", "meaning": "Dikaitkan dengan banyak keturunan."},
    3: {"name": "Sri", "meaning": "Dikaitkan dengan rezeki yang melimpah."},
    4: {"name": "Punggel", "meaning": "Dalam referensi petungan ini dikaitkan dengan salah satu pihak meninggal lebih dahulu."},
}

JODOH_RESULTS = {
    1: {"name": "Pegat", "meaning": "Perlu perhatian pada potensi konflik dan ketahanan hubungan."},
    2: {"name": "Ratu", "meaning": "Serasi dan dihormati; hubungan cenderung harmonis."},
    3: {"name": "Jodoh", "meaning": "Dipandang selaras dan mudah saling menerima."},
    4: {"name": "Topo", "meaning": "Membutuhkan kesabaran; kesulitan awal dapat menjadi proses pendewasaan."},
    5: {"name": "Tinari", "meaning": "Dikaitkan dengan kemudahan rezeki dan pertolongan."},
    6: {"name": "Padu", "meaning": "Perlu perhatian pada perbedaan pendapat dan komunikasi."},
    7: {"name": "Sujanan", "meaning": "Perlu perhatian pada kepercayaan, kecemburuan, dan komitmen."},
    8: {"name": "Pesthi", "meaning": "Dikaitkan dengan ketenteraman dan keharmonisan rumah tangga."},
}


def _remainder(total, divisor):
    return total % divisor or divisor


def get_jodoh(neptu_one, neptu_two):
    if not isinstance(neptu_one, int) or not isinstance(neptu_two, int):
        raise ValueError("Neptu pasangan harus berupa bilangan bulat.")
    if neptu_one <= 0 or neptu_two <= 0:
        raise ValueError("Neptu pasangan harus lebih besar dari nol.")

    total = neptu_one + neptu_two

    pitu_remainder = _remainder(total, 7)
    papat_remainder = _remainder(total, 4)
    wolu_remainder = _remainder(total, 8)

    pitu = PETUNGAN_PITU[pitu_remainder]
    papat = PETUNGAN_PAPAT[papat_remainder]
    wolu = JODOH_RESULTS[wolu_remainder]

    return {
        "neptu_one": neptu_one,
        "neptu_two": neptu_two,
        "total_neptu": total,
        "remainder": wolu_remainder,
        "name": wolu["name"],
        "meaning": wolu["meaning"],
        "method": "Total Neptu pasangan modulo 8; sisa 0 dibaca sebagai sisa 8.",
        "status": "TRADITIONAL_REFERENCE",
        "petungan": {
            "pitu": {
                "divisor": 7,
                "remainder": pitu_remainder,
                "name": pitu["name"],
                "meaning": pitu["meaning"],
                "method": "Total Neptu pasangan modulo 7; sisa 0 dibaca sebagai sisa 7.",
            },
            "papat": {
                "divisor": 4,
                "remainder": papat_remainder,
                "name": papat["name"],
                "meaning": papat["meaning"],
                "method": "Total Neptu pasangan modulo 4; sisa 0 dibaca sebagai sisa 4.",
            },
            "wolu": {
                "divisor": 8,
                "remainder": wolu_remainder,
                "name": wolu["name"],
                "meaning": wolu["meaning"],
                "method": "Total Neptu pasangan modulo 8; sisa 0 dibaca sebagai sisa 8.",
            },
        },
        "sources": [
            "https://github.com/dimasim/Kalkulator-Weton-App",
            "https://github.com/naufalist/weton",
        ],
    }
