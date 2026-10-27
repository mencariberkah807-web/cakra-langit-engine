import {
  CalendarDays,
  Compass,
  Home,
  Leaf,
  ListChecks,
  Moon,
  Sparkles,
  Sun,
  UserRound,
  WandSparkles,
  CircleUserRound,
  Map,
} from 'lucide-react'

// Grouped by Cakra Langit's four functional domains.
// Penanggalan opens the actual six-engine snapshot on the Dashboard.
export const navigationGroups = [
  {
    label: 'Personal Hub',
    items: [
      [Home, 'Dashboard', '/dashboard'],
      [CalendarDays, 'Penanggalan', '/dashboard#calendar-systems-section'],
      [Sun, 'Peta Hari Ini', '/dashboard/today'],
    ],
  },
  {
    label: 'Cetak Biru Diri',
    items: [
      [Sparkles, 'Primbon / Weton Jawa', '/dashboard/weton'],
      [CircleUserRound, 'BaZi China', '/dashboard/bazi'],
      [Leaf, 'Palintangan / Paririmbon Sunda', '/dashboard/paririmbon'],
      [Moon, 'Palelintangan Bali', '/dashboard/palelintangan'],
      [WandSparkles, 'Birth Converter', '/dashboard/birth-converter'],
    ],
  },
  {
    label: 'Strategi Waktu & Aksi',
    items: [
      [Compass, 'Palintangan', '/dashboard/palintangan'],
    ],
  },
  {
    label: 'Harmoni Tata Ruang',
    items: [
      [Map, 'Natural Layer', '/dashboard/natural'],
    ],
  },
]

export const primaryNav = navigationGroups.flatMap((group) => group.items)

export const personalNav = [
  [ListChecks, 'Personal Tasks', '/dashboard/tasks'],
  [UserRound, 'Profil Saya', '/dashboard/profile'],
  [CalendarDays, 'Riwayat', '/dashboard/history'],
]
