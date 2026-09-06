def get_sky_data(moon):
    illumination = moon.get("illumination", 0)

    return {
        "context": "Night sky",
        "bortle": "Bortle 5",
        "moonlight": "High" if illumination >= 60 else "Low",
    }
