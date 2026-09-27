import {
  CalendarDays,
  CircleUserRound,
  Home,
  Leaf,
  ListChecks,
  Moon,
  Sparkles,
  Sun,
  UserRound,
  WandSparkles,
} from 'lucide-react'

export const primaryNav = [
  [Home, 'Dashboard', '/dashboard'],
  [Sun, 'Kalkulasi Hari Ini', '/dashboard/today'],
  [Leaf, 'Natural Layer', '/dashboard/natural'],
  [WandSparkles, 'Birth Converter', '/dashboard/birth-converter'],
  [Sparkles, 'Weton', '/dashboard/weton'],
  [CircleUserRound, 'BaZi', '/dashboard/bazi'],
  [ListChecks, 'Paririmbon', '/dashboard/paririmbon'],
  [Moon, 'Almanac', '/dashboard/almanac'],
  [CalendarDays, 'Riwayat', '/dashboard/history'],
]

export const personalNav = [
  [ListChecks, 'Personal Tasks', '/dashboard/tasks'],
  [UserRound, 'Profil Saya', '/dashboard/profile'],
]
