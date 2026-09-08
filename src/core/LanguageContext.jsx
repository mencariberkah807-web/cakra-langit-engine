import { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "cakra-langit:language";
const LanguageContext = createContext(null);

const DICTIONARY = {
  en: {
    "Personal Almanac": "Personal Almanac", Explore: "Explore", Live: "Live", Past: "Past", "Selected Time": "Selected Time", Location: "Location", "Select location": "Select location", "Change Location": "Change Location", "Select a city and province in Indonesia.": "Select a city and province in Indonesia.", City: "City", Province: "Province", Searching: "Searching locations...", "Unable to search locations.": "Unable to search locations.", "No locations found.": "No locations found.", "Type a city name to search locations.": "Type a city name to search locations.", "Natural Layer": "Natural Layer", "Sun Path": "Sun Path", "Moon Path": "Moon Path", "Month Calendar": "Month Calendar", Time: "Time", Today: "Today", "Full Moon": "Full Moon", Eclipse: "Eclipse", "Calendar Systems": "Calendar Systems", Calendar: "Calendar", "Future engine": "Future engine", "Weton breakdown →": "Weton breakdown →", "Eclipse Detail": "Eclipse Detail", Close: "Close", Type: "Type", "Visibility region": "Visibility region", "Selected location": "Selected location", "Visible from Indonesia": "Visible from Indonesia", "Not visible from Indonesia": "Not visible from Indonesia", "Countdown to totality": "Countdown to totality", "No eclipse today": "No eclipse today", "No eclipse event": "No eclipse event", "No event today": "No event today", "There is no eclipse event on the selected date.": "There is no eclipse event on the selected date.", "Below horizon": "Below horizon", Altitude: "Altitude", Dawn: "Dawn", Sunrise: "Sunrise", Noon: "Noon", Sunset: "Sunset", Dusk: "Dusk", Age: "Age", days: "days", moonlight: "moonlight", Day: "Day", "of annual cycle": "of annual cycle", "No high tide": "No high tide", "No low tide": "No low tide", "Visibility data available": "Visibility data available",
  },
  id: {
    "Personal Almanac": "Almanak Pribadi", Explore: "Jelajahi", Live: "Langsung", Past: "Lampau", "Selected Time": "Waktu Terpilih", Location: "Lokasi", "Select location": "Pilih lokasi", "Change Location": "Ubah Lokasi", "Select a city and province in Indonesia.": "Pilih kota dan provinsi di Indonesia.", City: "Kota", Province: "Provinsi", Searching: "Mencari lokasi...", "Unable to search locations.": "Tidak dapat mencari lokasi.", "No locations found.": "Lokasi tidak ditemukan.", "Type a city name to search locations.": "Ketik nama kota untuk mencari lokasi.", "Natural Layer": "Lapisan Alam", "Sun Path": "Lintasan Matahari", "Moon Path": "Lintasan Bulan", "Month Calendar": "Kalender Bulanan", Time: "Waktu", Today: "Hari Ini", "Full Moon": "Bulan Purnama", Eclipse: "Gerhana", "Calendar Systems": "Sistem Kalender", Calendar: "Kalender", "Future engine": "Mesin masa depan", "Weton breakdown →": "Rincian Weton →", "Eclipse Detail": "Detail Gerhana", Close: "Tutup", Type: "Jenis", "Visibility region": "Wilayah terlihat", "Selected location": "Lokasi terpilih", "Visible from Indonesia": "Terlihat dari Indonesia", "Not visible from Indonesia": "Tidak terlihat dari Indonesia", "Countdown to totality": "Hitung mundur menuju totalitas", "No eclipse today": "Tidak ada gerhana hari ini", "No eclipse event": "Tidak ada peristiwa gerhana", "No event today": "Tidak ada peristiwa hari ini", "There is no eclipse event on the selected date.": "Tidak ada peristiwa gerhana pada tanggal terpilih.", "Below horizon": "Di bawah horizon", Altitude: "Ketinggian", Dawn: "Fajar", Sunrise: "Terbit", Noon: "Kulminasi", Sunset: "Terbenam", Dusk: "Senja", Age: "Usia", days: "hari", moonlight: "cahaya bulan", Day: "Hari", "of annual cycle": "dari siklus tahunan", "No high tide": "Tidak ada pasang tinggi", "No low tide": "Tidak ada surut rendah", "Visibility data available": "Data visibilitas tersedia",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "id";
    } catch {
      return "id";
    }
  });

  function setLanguage(next) {
    const value = next === "en" ? "en" : "id";
    setLanguageState(value);
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch { /* ignore */ }
  }

  const value = useMemo(() => ({ language, setLanguage, t: (key) => DICTIONARY[language][key] || key }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
