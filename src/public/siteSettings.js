const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const defaultSettings = {
  site_name: 'Cakra Langit',
  tagline: 'Personal Almanac',
  logo: null,
  favicon: null,
  hero_image: null,
  hero_title: 'Harmoni Langit, Panduan Kehidupan',
  hero_description: 'Cakra Langit membantu Anda memahami waktu, alam, dan diri melalui berbagai sistem kalender tradisional dan astronomi modern.',
  primary_cta_label: 'Mulai Jelajahi',
  secondary_cta_label: 'Pelajari Lebih Lanjut',
  feature_1_title: 'Akurat',
  feature_1_description: 'dengan data astronomi',
  feature_2_title: 'Menggabungkan',
  feature_2_description: 'kearifan tradisional',
  feature_3_title: 'Mudah digunakan',
  feature_3_description: 'untuk semua orang',
  feature_4_title: 'Selalu diperbarui',
  feature_4_description: 'setiap hari',
  login_image: null,
  page_title: null,
  meta_description: null,
}

export async function fetchSiteSettings() {
  try {
    const response = await fetch(`${API_BASE}/api/site/settings`)
    if (!response.ok) throw new Error('Site settings request failed')
    const payload = await response.json()
    return { ...defaultSettings, ...payload }
  } catch {
    return defaultSettings
  }
}

export { defaultSettings }
