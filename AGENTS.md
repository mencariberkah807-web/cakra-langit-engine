# AGENTS.md

# CAKRA LANGIT — AGENT OPERATING CONTRACT

This document is the operational contract for AI agents working on the repository. It reflects the current locked architecture and supersedes obsolete terminal-first instructions.

## 1. PRIMARY WORKFLOW

Every change follows:

```text
SCAN → IDENTIFY → PROPOSE → APPROVE → APPLY → VALIDATE
```

Rules:

- Inspect the actual repository state before changing anything.
- Prefer GitHub repository state as the shared source of truth for repository work.
- Do not guess implementation details.
- Preserve working behavior.
- Do not perform broad cleanup, refactoring, renaming, or architecture changes without explicit approval.
- Validate every applied change.
- Keep unrelated files and behavior untouched.

## 2. PROJECT IDENTITY

Cakra Langit is a Personal Almanac application combining calendar systems, traditional knowledge, astronomical computation, and natural phenomena.

It is not a simple date converter.

## 3. LOCKED UX ARCHITECTURE

```text
CAKRA LANGIT
│
├── /                         PUBLIC PAGE
│   └── Gambar 1 visual SSOT
│
├── /login                    AUTHENTICATION PAGE
│   └── Gambar 2 visual SSOT
│
├── /dashboard/*              PERSONAL / USER PAGE
│
└── /saehu                    PRIVATE ADMIN CMS
```

- `/` is the public face of the application.
- `/login` is the authentication boundary.
- `/dashboard/*` is the authenticated personal-user experience.
- `/saehu` is the private admin CMS entry point.
- `/calculation/*` is legacy and redirects to `/dashboard`.
- Do not introduce an `/admin/login` route.
- Do not add public admin links or menus.
- URL obscurity is not security; backend `role=admin` authorization is the real admin boundary.

## 4. UI ARCHITECTURE

Target component structure:

```text
src/
├── app/
│   ├── App.jsx
│   └── routing/
├── layouts/
│   ├── PublicLayout.jsx
│   ├── AuthLayout.jsx
│   └── UserLayout.jsx
├── components/
│   ├── navigation/
│   ├── shell/
│   ├── feedback/
│   └── data-display/
├── public/
│   └── PublicConverterLayer.jsx
├── auth/
│   ├── LoginPage.jsx
│   └── UserDashboardLayer.jsx
└── domain/
    ├── natural/
    ├── calendar/
    ├── weton/
    ├── bazi/
    └── paririmbon/
```

Layouts own page structure. Reusable components own presentation primitives. Domain components consume domain data. Calculation engines remain below this layer.

The authenticated user page must not literally wrap `PublicConverterLayer`; it may reuse shared Cakra components and data.

## 5. PUBLIC PAGE SSOT

The public page visual baseline is locked to Gambar 1.

Header contains:

- Cakra Langit logo/brand
- Beranda
- Almanac
- Natural Layer
- Kalender
- Tentang
- Search
- Guest: Masuk + Daftar
- Authenticated: Akun Saya

The header is locked. Do not alter it unless explicitly requested.

Public page structure:

```text
Public Navigation
↓
Ticker
↓
Hero
↓
Today / Natural Summary
↓
4 Feature Highlights
↓
Footer
```

Feature Highlights are a signup/conversion hook and their current enlarged typography is intentional.

## 6. AUTHENTICATION

The frontend uses the existing authentication context and token conventions. Do not redesign authentication casually.

Admin login must verify the backend user role. Current known admin validation:

```text
serialize_user(user).role === "admin"
```

The admin entry is `/saehu`.

## 7. ADMIN CMS — LOCKED SCOPE

The CMS scope is exactly:

```text
Brand
├── site_name
├── tagline
├── logo
└── favicon

Public Hero
├── hero_image
├── hero_title
├── hero_description
├── primary_cta_label
└── secondary_cta_label

Feature Highlights
├── feature_1_title
├── feature_1_description
├── feature_2_title
├── feature_2_description
├── feature_3_title
├── feature_3_description
├── feature_4_title
└── feature_4_description

Login
└── login_image

SEO
├── page_title
└── meta_description
```

CMS must not modify calculation engines.

## 8. LOCATION POLICY

Browser geolocation is preferred when available. Coordinates are resolved to the nearest supported Indonesian city for user-facing location.

Manual location selection takes precedence over automatic geolocation.

Latitude and longitude are internal metadata unless explicitly required by a feature.

## 9. DOMAIN / ENGINE PROTECTION

Calculation engines are protected domain implementations.

Correct dependency direction:

```text
ENGINE
  ↓
ADAPTER
  ↓
NORMALIZED DATA
  ↓
UI
```

Never move domain arithmetic into UI/dashboard code.

Never merge independent calendar systems into one generic calculation algorithm.

Natural engines must not alter calendar calculations.

## 10. DAY-BOUNDARY POLICY

There is no global calendar boundary. Engines may use:

```text
MIDNIGHT
SUNSET
SUNRISE
FIXED_TIME
ENGINE_SPECIFIC
```

Each engine owns its effective-date rule.

Never globally force all engines to midnight.

## 11. LOCKED CALENDAR BASELINES

### Saka Sunda / Surya Kala

```text
1 Kasa 1934 = 22 December 2011 Gregorian
```

```text
Wastu = 365 days
Wuntu = 366 days
Leap = divisible by 4
Exception = divisible by 128 returns to Wastu
```

Month structure and Hapitkayu extra-day behavior are protected.

### Kalacakra

```text
17 August 2024 12:00
= Tanggal 1 / I Kalacakra
```

Kalacakra behavior is protected. Integrate through an adapter and validate known anchors; do not rewrite the engine for UI convenience.

## 12. REGRESSION BASELINE

Use 27–28 August 2026 as a regression event case where applicable:

```text
27 August 2026
Jawa: Kamis Legi / 13 Mulud 1960 / Wuku Maktal
Chinese: Lunar 7/15 / Zhongyuan
Hindu: Shravana Purnima (tradition/location dependent)
Astronomy: near/full Moon period
28 August 2026: partial lunar eclipse; project baseline says not visible from Indonesia
```

Do not collapse a calendar date and an exact astronomical event instant into one concept.

## 13. SOURCE PROTECTION

`UGA KALA.pdf` is explicitly excluded from all project source-of-truth, reference, rule, and calculation work.

Approved sources must be explicitly authorized. In particular, do not use `UGA KALA.pdf` to derive or validate project rules.

## 14. VALIDATION

Before marking implementation complete:

```bash
npm run build
```

Run relevant tests when available. For backend/database changes, validate the affected API, migration, or persistence behavior as appropriate.

A successful build is mandatory before claiming a frontend phase complete.

## 15. CHANGE SAFETY

Before editing:

1. Identify the authoritative implementation.
2. Identify dependencies and protected behavior.
3. State the proposed change and its scope.
4. Obtain approval when the change is architectural, destructive, broad, or touches locked behavior.
5. Apply only the approved change.
6. Validate and report exact results.

Do not silently expand scope.

## 16. CURRENT REPOSITORY BASELINE

The current GitHub `main` baseline includes:

```text
Admin route: /saehu
Admin role authorization: working
Site Settings backend: established
Site Assets backend: established
Public CMS settings API: established
Browser geolocation: established
Public Header: locked
Public Page architecture: locked
```

The repository's current baseline must be treated as working code, not raw material for unrelated refactoring.
