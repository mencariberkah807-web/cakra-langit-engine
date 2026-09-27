# AGENTS.md

# CAKRA LANGIT — AGENT OPERATING CONTRACT

This document is the operational contract for AI agents working on the repository. It defines the current locked architecture, domain boundaries, source-of-truth rules, and implementation workflow.

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
- If an architectural change is requested, update this contract before implementing dependent code.

## 2. PROJECT IDENTITY

Cakra Langit is a Personal Almanac application combining:

- calendar systems,
- traditional knowledge,
- personal birth-profile systems,
- time/action systems,
- spatial/harmony systems,
- astronomical computation,
- natural phenomena.

It is not a simple date converter.

The system is organized around four functional layers:

```text
CAKRA LANGIT
│
├── 01 PENANGGALAN
│   └── Establishes the temporal/calendar context.
│
├── 02 CETAK BIRU DIRI
│   └── Establishes the personal birth/profile context.
│
├── 03 STRATEGI WAKTU & AKSI
│   └── Reads timing, direction, selection, and action context.
│
└── 04 HARMONI TATA RUANG
    └── Reads place, orientation, and environmental/spatial context.
```

These four layers are a product/domain taxonomy. They do not require every layer to have a completed engine before the architecture can be represented.

## 3. CULTURAL / DOMAIN MAPPING

Cakra Langit provides a common application architecture while keeping each tradition's calculation system independent.

### 3.1 Penanggalan

```text
PENANGGALAN
│
├── Gregorian / Solar
├── Lunar / Chinese calendar
├── Hijri
├── Jawa
├── Sunda / Saka Sunda
├── Bali
└── Kalacakra
```

Calendar systems must remain independent. A calendar result may provide context to another engine, but one tradition's calendar arithmetic must never be silently substituted for another's.

### 3.2 Cetak Biru Diri

```text
CETAK BIRU DIRI
│
├── BaZi / Four Pillars
├── Weton Jawa / Petungan Neptu
└── Candra Bhumi / Weton Sunda
```

The personal layer consumes a birth profile. It must not be reconstructed from today's date alone.

Birth-profile data is separate from `TodayContext`.

### 3.3 Strategi Waktu & Aksi

```text
STRATEGI WAKTU & AKSI
│
├── Palintangan / Paririmbon Sunda
├── Qi Men / comparable time-action systems
└── other explicitly verified timing/action methods
```

This layer may consume:

- Penanggalan context,
- personal profile context,
- location context,
- selected date/time.

It must not alter the underlying calendar or personal-profile engines.

### 3.4 Harmoni Tata Ruang

```text
HARMONI TATA RUANG
│
├── Feng Shui / spatial systems
└── other explicitly verified spatial/environmental methods
```

Spatial calculations consume location/orientation/environmental context where required. They must remain independent from calendar arithmetic and personal birth calculations.

Do not implement undocumented formulas merely to fill a UI slot.

## 4. CORE CONTEXT ARCHITECTURE

The application has two distinct context classes.

### 4.1 TodayContext — temporal/live context

`TodayContext` is the SSOT for the active temporal observation context.

It may contain:

```text
now
selectedDate
selectedTime
selectedLocation
apiData
mode
calendar context
natural context
```

Its responsibility is to answer:

> What is the temporal and environmental context for the date, time, and location currently being inspected?

It must not become the permanent store for a user's birth identity.

### 4.2 Personal Profile Context — identity/birth context

Personal birth/profile data is a separate conceptual context.

Target dependency:

```text
User / Profile
    ↓
Personal Profile Context
    ↓
BaZi / Weton / Candra Bhumi / personal methods
```

Do not place birth date, birth time, birth location, or permanent personal calculation inputs into `TodayContext` merely for convenience.

If a `ProfileContext` is introduced, it must own personal identity/profile state while consuming `TodayContext` only where a calculation requires current temporal context.

### 4.3 Location Context

Location is a shared contextual input but remains distinct from personal identity.

```text
Location
├── temporal timezone / local date-time
├── natural observation
├── spatial/harmony calculations
└── location-sensitive traditional calculations
```

Manual location selection takes precedence over automatic geolocation.

## 5. DOMAIN DEPENDENCY DIRECTION

The protected dependency direction is:

```text
ENGINE
  ↓
ADAPTER
  ↓
NORMALIZED RESULT
  ↓
DOMAIN / UI
```

For cross-layer calculations:

```text
CONTEXT
  ↓
ENGINE
  ↓
ADAPTER
  ↓
NORMALIZED RESULT
  ↓
UI
```

Rules:

- Never move domain arithmetic into React components.
- Never duplicate engine formulas in UI code.
- Never use UI labels as a substitute for domain rules.
- Never merge independent traditional systems into one generic calculation algorithm.
- Natural engines must not alter calendar calculations.
- Calendar engines must not alter personal-profile calculations.
- Personal-profile engines must not silently alter timing/action rules.
- Spatial engines must not silently alter calendar or birth calculations.

## 6. ENGINE / ADAPTER / REGISTRY ARCHITECTURE

The existing repository already uses an adapter pattern.

```text
src/core/
├── TodayContext.jsx
├── context.js
└── resultRegistry.js

src/adapters/
├── adapterContract.js
├── gregorian.adapter.js
├── jawa.adapter.js
├── sakaSunda.adapter.js
├── bali.adapter.js
├── kalacakra.adapter.js
├── chineseLunar.adapter.js
├── hijri.adapter.js
├── sun.adapter.js
├── moon.adapter.js
├── eclipse.adapter.js
├── sky.adapter.js
├── earth.adapter.js
└── tide.adapter.js
```

`resultRegistry.js` is the registry/orchestration layer for normalized frontend results.

When adding a new engine:

1. Keep the calculation in the appropriate engine/domain layer.
2. Create or extend an adapter where appropriate.
3. Normalize the result through the existing result contract.
4. Register it explicitly.
5. Consume the normalized result from UI.
6. Do not bypass the adapter merely because the UI needs one field.

The registry taxonomy may expand to reflect the four Cakra Langit functional layers, but this does not authorize rewriting existing engines.

## 7. CURRENT BACKEND DOMAIN ENGINES

The repository currently contains established backend engines including:

```text
backend/engines/
├── calendar_engine.py
├── bazi_engine.py
├── jawa_engine.py
├── palintangan_sunda_engine.py
├── hijri_engine.py
├── solar_engine.py
├── moon_engine.py
├── eclipse_engine.py
├── sky_engine.py
├── earth_engine.py
├── tide_engine.py
└── location_engine.py
```

Existing engine behavior is protected.

In particular:

- `bazi_engine.py` belongs to Cetak Biru Diri.
- `jawa_engine.py` belongs to the Jawa calendar/personal domain according to its actual output.
- `palintangan_sunda_engine.py` belongs to Strategi Waktu & Aksi.
- calendar engines belong to Penanggalan.
- natural/astronomical engines provide contextual data and must remain separate from traditional calendar arithmetic.

Do not infer undocumented formulas from names alone. Inspect the authoritative implementation and source material.

## 8. PARIRIMBON / PALINTANGAN BOUNDARY

Paririmbon Sunda is a knowledge/source layer and Palintangan Sunda is an implementation/calculation layer where verified rules exist.

```text
PARIRIMBON SUNDA
│
├── source-backed knowledge
├── Naktu
├── calendar components
├── Pernaasan data
├── Watek
└── method/source status
          ↓
PALINTANGAN SUNDA ENGINE
          ↓
NORMALIZED RESULT
          ↓
UI
```

Rules:

- Keep source data and calculation rules distinguishable.
- A documented data table is not automatically a formula.
- If a formula is unknown, preserve the data without inventing the derivation.
- Do not convert incomplete research into authoritative calculation.
- `UGA KALA.pdf` remains explicitly excluded; see Source Protection.

## 9. LOCKED UX ARCHITECTURE

```text
CAKRA LANGIT
│
├── /                         PUBLIC PAGE
│
├── /login                    AUTHENTICATION PAGE
│
├── /dashboard/*              PERSONAL / USER EXPERIENCE
│
└── /saehu                    PRIVATE ADMIN CMS
```

Rules:

- `/` is the public face of the application.
- `/login` is the authentication boundary.
- `/dashboard/*` is the authenticated personal-user experience.
- `/saehu` is the private admin CMS entry point.
- `/calculation/*` is legacy and redirects to `/dashboard`.
- Do not introduce an `/admin/login` route.
- Do not add public admin links or menus.
- URL obscurity is not security; backend `role=admin` authorization is the real admin boundary.

The authenticated user experience must not literally wrap `PublicConverterLayer`; it may reuse shared Cakra components and data.

## 10. UI ARCHITECTURE

Target separation:

```text
LAYOUT
  ↓
DOMAIN PAGE / COMPONENT
  ↓
ADAPTER / NORMALIZED RESULT
  ↓
ENGINE
```

The repository may use the current physical structure while the domain architecture evolves:

```text
src/
├── app/
├── layouts/
├── components/
├── public/
├── auth/
├── core/
├── adapters/
├── engines/
└── dashboard/
```

Do not force a directory migration solely to satisfy the conceptual taxonomy.

Layouts own page structure. Reusable components own presentation primitives. Domain components consume domain data. Calculation engines remain below this layer.

## 11. PUBLIC PAGE SSOT

The public page visual baseline is locked.

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

## 12. AUTHENTICATION

The frontend uses the existing authentication context and token conventions. Do not redesign authentication casually.

Admin login must verify the backend user role. Current known admin validation:

```text
serialize_user(user).role === "admin"
```

The admin entry is `/saehu`.

## 13. ADMIN CMS — LOCKED SCOPE

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

## 14. LOCATION POLICY

Browser geolocation is preferred when available. Coordinates are resolved to the nearest supported Indonesian city for user-facing location.

Manual location selection takes precedence over automatic geolocation.

Latitude and longitude are internal metadata unless explicitly required by a feature.

Location resolution must not be used to infer personal identity.

## 15. DAY-BOUNDARY POLICY

There is no global calendar boundary.

Engines may use:

```text
MIDNIGHT
SUNSET
SUNRISE
FIXED_TIME
ENGINE_SPECIFIC
```

Each engine owns its effective-date rule.

Never globally force all engines to midnight.

## 16. LOCKED CALENDAR BASELINES

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

## 17. REGRESSION BASELINE

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

## 18. SOURCE PROTECTION

`UGA KALA.pdf` is explicitly excluded from all project source-of-truth, reference, rule, and calculation work.

Approved sources must be explicitly authorized.

Source hierarchy:

```text
AUTHORIZED PRIMARY SOURCE
        ↓
VERIFIED RULE / DATA
        ↓
ENGINE IMPLEMENTATION
        ↓
ADAPTER
        ↓
UI
```

If a source only documents an output but not its derivation, preserve the output as source-backed data and do not invent a formula.

## 19. VALIDATION

Before marking implementation complete:

```bash
npm run build
```

Run relevant tests when available.

For backend/database changes, validate the affected API, migration, or persistence behavior as appropriate.

A successful build is mandatory before claiming a frontend phase complete.

For architecture changes, also verify:

- existing routes remain intact;
- existing engine outputs remain intact;
- adapter contracts remain intact;
- no unrelated calculation behavior changed.

## 20. CHANGE SAFETY

Before editing:

1. Identify the authoritative implementation.
2. Identify dependencies and protected behavior.
3. State the proposed change and its scope.
4. Obtain approval when the change is architectural, destructive, broad, or touches locked behavior.
5. Apply only the approved change.
6. Validate and report exact results.

Do not silently expand scope.

Architecture updates must not be used as permission for unrelated refactoring.

## 21. CURRENT REPOSITORY BASELINE

The current GitHub `main` baseline includes:

```text
Admin route: /saehu
Admin role authorization: established
Site Settings backend: established
Site Assets backend: established
Public CMS settings API: established
Browser geolocation: established
Public Header: locked
Public Page architecture: locked

Core temporal context:
TodayContext: established

Frontend normalization:
Adapters: established
Result Registry: established

Backend domain engines:
Calendar: established
BaZi: established
Jawa: established
Palintangan Sunda: established
Natural/Astronomical engines: established
```

The repository's current baseline must be treated as working code, not raw material for unrelated refactoring.

The four-layer taxonomy is now the architectural direction:

```text
01 PENANGGALAN
02 CETAK BIRU DIRI
03 STRATEGI WAKTU & AKSI
04 HARMONI TATA RUANG
```

This taxonomy organizes existing and future capabilities; it does not authorize replacing working engines or inventing missing domain rules.
