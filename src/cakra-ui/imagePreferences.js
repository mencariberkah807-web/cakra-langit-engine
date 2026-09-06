const DB_NAME = 'cakra-langit-assets'
const STORE_NAME = 'images'
const DB_VERSION = 1

export const IMAGE_RULES = {
  logo: { label: 'Logo', maxBytes: 500 * 1024, maxWidth: 1000, maxHeight: 1000 },
  login: { label: 'Login Image', maxBytes: 2 * 1024 * 1024, maxWidth: 1600, maxHeight: 2000 },
  publicHero: { label: 'Public Hero Image', maxBytes: 2 * 1024 * 1024, maxWidth: 2400, maxHeight: 1400 },
}

export const TOTAL_IMAGE_QUOTA = 10 * 1024 * 1024

function openDb() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Tidak dapat membuka penyimpanan gambar.'))
  })
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Operasi penyimpanan gambar gagal.'))
  })
}

export async function getImage(key) {
  const db = await openDb()
  try {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    return await requestResult(transaction.objectStore(STORE_NAME).get(key))
  } finally {
    db.close()
  }
}

export async function getStoredImageBytes() {
  const db = await openDb()
  try {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const records = await requestResult(transaction.objectStore(STORE_NAME).getAll())
    return records.reduce((sum, record) => sum + (record.bytes || 0), 0)
  } finally {
    db.close()
  }
}

export async function deleteImage(key) {
  const db = await openDb()
  try {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    await requestResult(transaction.objectStore(STORE_NAME).delete(key))
  } finally {
    db.close()
  }
}

function loadImage(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('File gambar tidak dapat dibaca.'))
    }
    image.src = url
  })
}

async function optimizeImage(file, rule) {
  if (!file.type.startsWith('image/')) {
    throw new Error(`${rule.label} harus berupa file gambar.`)
  }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Gunakan JPG, PNG, atau WebP. SVG tidak didukung.')
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File sumber terlalu besar. Maksimum file upload adalah 10 MB.')
  }

  const image = await loadImage(file)
  const scale = Math.min(1, rule.maxWidth / image.naturalWidth, rule.maxHeight / image.naturalHeight)
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, width, height)

  let quality = 0.86
  let blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
  while (blob && blob.size > rule.maxBytes && quality > 0.45) {
    quality -= 0.08
    blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
  }

  if (!blob || blob.size > rule.maxBytes) {
    throw new Error(`${rule.label} masih terlalu besar setelah kompresi. Gunakan gambar yang lebih sederhana.`)
  }

  return { blob, width, height, bytes: blob.size }
}

export async function saveImage(key, file) {
  const rule = IMAGE_RULES[key]
  if (!rule) throw new Error('Jenis gambar tidak dikenal.')

  const optimized = await optimizeImage(file, rule)
  const existing = await getImage(key)
  const currentTotal = await getStoredImageBytes()
  const nextTotal = currentTotal - (existing?.bytes || 0) + optimized.bytes

  if (nextTotal > TOTAL_IMAGE_QUOTA) {
    throw new Error('Batas penyimpanan gambar 10 MB tercapai. Hapus gambar lain sebelum menyimpan.')
  }

  const db = await openDb()
  try {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const record = {
      key,
      blob: optimized.blob,
      bytes: optimized.bytes,
      width: optimized.width,
      height: optimized.height,
      updatedAt: Date.now(),
    }
    await requestResult(transaction.objectStore(STORE_NAME).put(record))
    return record
  } finally {
    db.close()
  }
}
