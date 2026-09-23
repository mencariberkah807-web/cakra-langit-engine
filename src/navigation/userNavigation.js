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

export const workspaceNav = [
  [Home, 'Dashboard', '/dashboard'],
  [Leaf, 'Natural Layer', '/dashboard/natural'],
  [WandSparkles, 'Birth Converter', '/dashboard/birth-converter'],
]

export const palintanganNav = [
  [Sun, 'Daily Global', '/dashboard/palintangan'],
  [UserRound, 'Hitung Nama', '/dashboard/palintangan/nama'],
  [CalendarDays, 'Kelahiran', '/dashboard/palintangan/kelahiran'],
  [CircleUserRound, 'Repok / Jodoh', '/dashboard/palintangan/repok'],
  [Leaf, 'Tanam / Panen', '/dashboard/palintangan/tanam'],
  [Moon, 'Perjalanan / Arah', '/dashboard/palintangan/arah'],
  [Sparkles, 'Waktu / Jam', '/dashboard/palintangan/waktu'],
]

export const converterNav = [
  [Sparkles, 'Weton', '/dashboard/weton'],
  [Sun, 'Palintangan', '/dashboard/palintangan'],
  [Moon, 'Palelintangan', '/dashboard/palelintangan'],
  [CircleUserRound, 'BaZi', '/dashboard/bazi'],
]

export const personalNav = [
  [UserRound, 'Profil Saya', '/dashboard/profile'],
  [ListChecks, 'Personal Tasks', '/dashboard/tasks'],
]

export const primaryNav = [...workspaceNav, ...converterNav, ...personalNav]
