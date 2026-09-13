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


def get_jodoh(neptu_one, neptu_two):
    if not isinstance(neptu_one, int) or not isinstance(neptu_two, int):
        raise ValueError("Neptu pasangan harus berupa bilangan bulat.")
    if neptu_one <= 0 or neptu_two <= 0:
        raise ValueError("Neptu pasangan harus lebih besar dari nol.")

    total = neptu_one + neptu_two
    remainder = total % 8 or 8
    result = JODOH_RESULTS[remainder]

    return {
        "neptu_one": neptu_one,
        "neptu_two": neptu_two,
        "total_neptu": total,
        "remainder": remainder,
        "name": result["name"],
        "meaning": result["meaning"],
        "method": "Total Neptu pasangan modulo 8; sisa 0 dibaca sebagai sisa 8.",
        "status": "TRADITIONAL_REFERENCE",
    }
