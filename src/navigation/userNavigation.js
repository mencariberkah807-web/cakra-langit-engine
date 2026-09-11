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
