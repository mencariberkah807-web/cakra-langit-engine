const DAY_MS = 86400000

const WULAN = [
  'Sura',
  'Sapar',
  'Mulud',
  'Bakdamulud',
  'Jumadilawal',
  'Jumadilakir',
  'Rejeb',
  'Ruwah',
  'Pasa',
  'Sawal',
  'Dulkangidah',
  'Besar',
]

const TAUN = [
  'Alip',
  'Ehe',
  'Jimawal',
  'Je',
  'Dal',
  'Be',
  'Wawu',
  'Jimakir',
]

const PAS = ['Pon', 'Wage', 'Kliwon', 'Legi', 'Pahing']

const MINGGU = [
  'Senen',
  'Selasa',
  'Rebo',
  'Kemis',
  'Jemuwah',
  'Setu',
  'Ngahad',
]

const WUKU = [
  'Sinta',
  'Landep',
  'Wukir',
  'Kurantil',
  'Tolu',
  'Gumbreg',
  'Warigalit',
  'Warigagung',
  'Julungwangi',
  'Sungsang',
  'Galungan',
  'Kuningan',
  'Langkir',
  'Mandasiya',
  'Julungpujut',
  'Pahang',
  'Kuruwelut',
  'Marakeh',
  'Tambir',
  'Medangkungan',
  'Maktal',
  'Wuye',
  'Manahil',
  'Prangbakat',
  'Bala',
  'Wugu',
  'Wayang',
  'Kulawu',
  'Dukut',
  'Watugunung',
]

const WINDU = ['Adi', 'Kuntara', 'Sengara', 'Sancaya']

const LAMBANG = ['Langkir', 'Kulawu']

const KURUP = [
  ['Jamingiyah', "A'ahgi", 1555, 0],
  ['Kamsiyah', 'Amiswon', 1675, 0],
  ['Arbangiyah', 'Aboge', 1749, 2],
  ['Salasiyah', 'Asapon', 1867, 0],
]

const ORIGIN = Date.UTC(1633, 6, 8)

const mod = (a, b) => ((a % b) + b) % b

const monthSum = (months) =>
  months.reduce((total, value) => total + value, 0)

function buildWT(maxYear = 2200) {
  const w354 = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29]
  const w355 = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30]

  const wtd1 = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30]
  const wtd2 = [30, 30, 29, 29, 30, 29, 30, 29, 30, 29, 30, 30]
  const wtd3 = [30, 30, 29, 29, 29, 29, 30, 29, 30, 29, 30, 30]
  const wtd4 = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29]

  const years = []

  for (let y = 1555; y <= maxYear; y += 1) {
    let k = KURUP.findIndex(
      (r, i) =>
        y >= r[2] &&
        (i === KURUP.length - 1 || y < KURUP[i + 1][2])
    )

    if (k < 0) k = KURUP.length - 1

    const pos = mod(y - 1555, 8)

    let months

    if (pos === 4) {
      months = [wtd1, wtd2, wtd3, wtd4][Math.min(k, 3)]
    } else if (pos === 1 || pos === 7) {
      months = w355
    } else if (pos === 3 && k >= 2) {
      months = w355
    } else {
      months = w354
    }

    years.push({ y, months: [...months], k })
  }

  for (let i = 0; i < KURUP.length; i += 1) {
    const end =
      i < KURUP.length - 1
        ? KURUP[i + 1][2] - 1
        : KURUP[i][2] + 119

    const record = years.find((year) => year.y === end)

    if (record) record.months[11] -= 1
  }

  return years
}

const YEARS = buildWT()

function jawaFromGregorian(y, m, d) {
  const dt = Date.UTC(y, m - 1, d)

  if (dt < ORIGIN) {
    throw new Error('Tanggal sebelum 8 Juli 1633 tidak didukung.')
  }

  const dti = Math.floor((dt - ORIGIN) / DAY_MS) + 1

  let remain = dti
  let record = null

  for (const year of YEARS) {
    const total = monthSum(year.months)

    if (remain <= total) {
      record = year
      break
    }

    remain -= total
  }

  if (!record) {
    throw new Error('Tanggal di luar rentang engine.')
  }

  let monthIndex = 0

  while (remain > record.months[monthIndex]) {
    remain -= record.months[monthIndex]
    monthIndex += 1
  }

  const day = remain
  const yearIndex = mod(record.y - 1555, 8)
  const serial = Math.floor(dt / DAY_MS)

  const utcWeekday = new Date(dt).getUTCDay()

  const dayName =
    MINGGU[(utcWeekday + 6) % 7]

  const pasaran =
    PAS[mod(serial + 2, 5)]

  const wuku =
    WUKU[
      mod(
        Math.floor((serial - 2) / 7) + 25,
        30
      )
    ]

  const kurupIndex = KURUP.findIndex(
    (r, i) =>
      record.y >= r[2] &&
      (i === KURUP.length - 1 || record.y < KURUP[i + 1][2])
  )

  const winduIndex =
    Math.floor((record.y - 1555) / 8)

  return {
    day,
    month: monthIndex + 1,
    monthIndex,
    monthName: WULAN[monthIndex],

    year: record.y,
    yearName: TAUN[yearIndex],

    dayName,
    pasaran,
    weton: `${dayName} ${pasaran}`,

    wuku,

    windu: WINDU[mod(winduIndex, 4)],
    lambang: LAMBANG[mod(winduIndex, 2)],

    kurup:
      KURUP[
        kurupIndex >= 0
          ? kurupIndex
          : KURUP.length - 1
      ][0],
  }
}

export function getJawaCalendar(context) {
  const date = context.time.instant

  const effectiveDate = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )
  )

  return {
    ...jawaFromGregorian(
      effectiveDate.getUTCFullYear(),
      effectiveDate.getUTCMonth() + 1,
      effectiveDate.getUTCDate()
    ),

    effectiveDate,
    boundary: 'MIDNIGHT',

    meta: {
      engine: 'Jawa',
      phase: 'SOURCE_COMPILED',
      sunsetApplied: false,
    },
  }
}
