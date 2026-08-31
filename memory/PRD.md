# PRD — Personal Almanac V1 (Explore Dashboard)

## Original Problem Statement
"create dashboard ui" — with a supplied visual baseline image of "PERSONAL ALMANAC V1": a light-themed dashboard exploring natural cycles (sun, moon, eclipse, sky, earth-space, tide) and Indonesian/world calendar systems (Jawa, Saka Sunda, Bali, Kalacakra, Candra Kala, Cannse Lunar, Hijri), with a month calendar, time selector, location dropdown (Bandung default), live clock, and schedule timeline.

## User Choices
- Live data: real sunrise/sunset times and working calendar calculations for the selected location (not static mockup data).
- Main dashboard only (no design-spec side panels).

## User Personas
- Indonesian culture/calendar enthusiast checking weton, wuku, pawukon for any date.
- Observer/photographer planning around sunrise, golden hour, moon phase.
- Design-conscious user expecting the exact visual baseline with premium motion.

## Core Requirements (static)
- Faithful light-theme baseline: #F8FAFC bg, white cards, #E2E8F0 borders, #0F172A navy.
- Live clock in selected city's timezone; location switcher (6 Indonesian cities).
- Month calendar with prev/next, day select, time scrubber, jump-to-today.
- Natural layer: sun times (astral), moon phase/age, eclipse status, earth-space day-of-year, tide placeholder.
- Calendar systems: Jawa (weton, neptu, wuku, tahun, windu), Saka Sunda, Bali (pawukon), Hijri (Ummul Qura via hijri-converter); Kalacakra/Candra Kala/Cannse Lunar as "Future engine".
- Schedule timeline from real sun events; telemetry marquee ticker; footer status bar.
- Premium motion: framer-motion staggered reveals, masked heading reveal, hover lifts, lenis smooth scroll.

## Implemented
- 2026-08-31: Full stack v1. FastAPI `/api/locations` + `/api/almanac` (astral sun calc, synodic moon, pasaran anchored to verified sources — 27 Aug 2026 = Kamis Legi, Wuku Maktal, Tahun Be, Windu Sengara confirmed against published Indonesian calendar references). React dashboard with Header (live clock, location Select), NaturalLayer, CalendarSystems, MonthCalendar, ScheduleTimeline, Ticker marquee, Footer. Fonts: Cabinet Grotesk / Plus Jakarta Sans / JetBrains Mono. Verified via curl + browser screenshots (date pick, city switch to Denpasar/WITA, toast, PAST badge).

## Known Approximations
- Hijri uses Umm al-Qura tables (hijri-converter); may differ ±1 day from Indonesian government (hisab/rukyat) dates.
- Saka Sunda sasih mapped from Javanese month names; tide card is placeholder ("requires local model"), as in the baseline.

## Backlog
- P0: none blocking.
- P1: Weton detail modal (neptu breakdown, watak), eclipse detail drawer, next-event quick jumps (Next Full Moon, Next Eclipse).
- P2: Kalacakra / Candra Kala / Cannse Lunar engines, tide model for coastal cities, sun-arc SVG visualizer, moon phase canvas, custom coordinates input.

## Next Tasks
1. Weton detail modal on calendar card click.
2. Sun arc SVG day visualizer driven by the time scrubber.
3. Quick-jump presets (Today, Next Full Moon, Next Eclipse).
