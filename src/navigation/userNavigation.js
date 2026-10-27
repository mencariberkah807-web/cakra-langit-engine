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
  Clock3,
  Map,
} from 'lucide-react'

// Grouped by Cakra Langit's four functional domains.
// Only routes already supported by the application are linked here.
export const navigationGroups = [
  {
    label: 'Personal Hub',
    items: [
      [Home, 'Dashboard', '/dashboard'],
      [CalendarDays, 'Penanggalan', '/dashboard/almanac'],
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
      [Clock3, 'Almanac', '/dashboard/almanac'],
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
