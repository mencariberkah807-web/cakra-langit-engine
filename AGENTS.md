# AGENTS.md

# CAKRA LANGIT — CODEX OPERATING CONTRACT

This document is the operational contract for Codex/AI agents working on the repository. It defines the current locked product concept, architecture, domain boundaries, source-of-truth rules, execution order, and validation requirements.

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
- Work in explicit checkpoints. Do not combine unrelated phases into one change.

## 2. PROJECT IDENTITY — CAKRA LANGIT IS THE ROOT

Cakra Langit is a **Global Personal Almanac / Meta-System**.

It is NOT one calendar, one primbon, one cultural calculation system, or one traditional method.

Cakra Langit is the root system that can:

- provide shared temporal, location, natural, and profile context;
- execute independent calculation methods;
- preserve each method's original rules and identity;
- normalize results into common application contracts;
- compile multiple method results into a Global Snapshot;
- present the combined snapshot through the Global Dashboard;
- expand to additional traditions and calculation systems without replacing the root architecture.

Conceptually:

```text
                         CAKRA LANGIT
                       GLOBAL ROOT SYSTEM
                              │
                     METHOD / ENGINE LIBRARY
                              │
             ┌────────────────┼────────────────┐
             │                │                │
          PENANGGALAN    CETAK BIRU       STRATEGI &
                          DIRI              AKSI
             │                │                │
             └────────────────┼────────────────┘
                              │
                       HARMONI TATA RUANG
                              │
                       NATURAL CONTEXT
                              │
                              ↓
                     NORMALIZED RESULTS
                              ↓
                     GLOBAL SNAPSHOT
                              ↓
                    GLOBAL DASHBOARD
```

The term "compile" is architectural/product language. It means Cakra Langit orchestrates different systems without rewriting their internal rules into one universal formula.

### Core principle

> Different traditions remain different systems. Cakra Langit integrates their outputs into one contextual view.

Therefore:

- Primbon remains Primbon.
- Paririmbon remains Paririmbon.
- BaZi remains BaZi.
- Wariga remains Wariga.
- Hijriah remains Hijriah.
- Kalacakra remains Kalacakra.
- Maya remains Maya.
- Aztec remains Aztec.
- Future systems remain their own systems.

Do not flatten them into one generic calculation.

## 3. FUNCTIONAL TAXONOMY

The current functional taxonomy is:

```text
CAKRA LANGIT
│
├── 01 PENANGGALAN
│   └── Establishes temporal/calendar context.
│
├── 02 CETAK BIRU DIRI
│   └── Establishes personal birth/profile context.
│
├── 03 STRATEGI WAKTU & AKSI
│   └── Reads timing, direction, selection, and action context.
│
└── 04 HARMONI TATA RUANG
    └── Reads place, orientation, and spatial/environmental context.
```

Natural/Astronomical context is a cross-cutting contextual layer supporting the Global Snapshot. It is not a replacement for the four functional domains.

These four layers are a product/domain taxonomy. They do not require every layer to have a completed engine before the architecture can represent it.

## 4. METHOD / CULTURAL SYSTEM MAPPING

Cakra Langit provides a common integration architecture while keeping each tradition's calculation system independent.

### 4.1 Jawa

```text
JAWA
└── PRIMBON
    ├── Weton
    ├── Neptu
    ├── Petungan
    └── other verified methods
```

Primbon is a Jawa knowledge system. Do not treat it as a generic label for all traditional calculation systems.

### 4.2 Sunda

```text
SUNDA
└── PARIRIMBON
    ├── Naktu
    ├── Watek
    ├── Pernaasan
    ├── Palintangan
    └── other verified methods
```

Paririmbon is the Sunda knowledge/source system. Palintangan is a calculation/method domain within that knowledge where verified rules exist.

### 4.3 China

```text
CHINA
└── TRADITIONAL METAPHYSICS / SHU SHU
    ├── BaZi
    ├── Qi Men Dun Jia
    ├── Zi Wei Dou Shu
    └── other explicitly verified systems
```

Do not collapse Chinese calendar arithmetic, BaZi, Qi Men, or other systems into one engine.

### 4.4 Bali

```text
BALI
└── WARIGA
    ├── Wewaran
    ├── Pawukon
    ├── Ala Ayuning Dewasa
    └── other verified methods
```

Wariga is a Bali knowledge system. Individual calendar and timing methods remain independently implemented.

### 4.5 Islamic / Hijri

```text
ISLAMIC / HIJRI
├── Hijri Calendar
├── Hisab
├── Rukyah
└── Ilmu Falak / related astronomical methods
```

Calendar calculation and broader astronomical methodology must remain conceptually distinct.

### 4.6 Kalacakra

Kalacakra is **one system inside Cakra Langit**, not the root of Cakra Langit.

```text
CAKRA LANGIT
└── PENANGGALAN / OTHER METHOD DOMAINS
    └── KALACAKRA
```

Kalacakra must retain its own rules, anchors, and engine.

### 4.7 Maya, Aztec, and future systems

The architecture must be able to add:

```text
Maya
Aztec
Mesopotamian
Egyptian
Tibetan
Indian
Japanese
Nusantara
...
```

without changing the identity of Cakra Langit or merging their rules.

Only verified systems and rules may be implemented.

## 5. GLOBAL DASHBOARD AND COMPLETE SNAPSHOT

The Dashboard is the **Global Dashboard of Cakra Langit**.

It is not a Jawa dashboard, Sunda dashboard, China dashboard, or Natural Layer dashboard.

Its purpose is to show a complete contextual snapshot assembled from available engines and methods.

Conceptually:

```text
CONTEXT
  │
  ├── selected date
  ├── selected time
  ├── location
  ├── natural/astronomical context
  └── personal profile when applicable
           │
           ↓
     METHOD / ENGINE LIBRARY
           │
           ↓
    NORMALIZED RESULTS
           │
           ↓
      GLOBAL SNAPSHOT
           │
           ↓
     CAKRA LANGIT
       DASHBOARD
```

The current dashboard may contain snapshots such as:

- Jawa
- Saka Sunda
- Kalacakra
- Bali
- Chinese Lunar
- Hijri
- Solar events
- Lunar events
- Sky
- Earth/natural context
- Tide
- Paririmbon / Palintangan
- personal blueprint results
- future Maya/Aztec and other systems

The dashboard must not calculate domain formulas itself.

It consumes normalized results.

Adding a new method must not require turning the dashboard into a method-specific page.

## 6. COMPLETE SNAPSHOT PRINCIPLE

A Global Snapshot is a collection of independent observations for a common context.

Example:

```text
GLOBAL SNAPSHOT
│
├── CALENDAR
│   ├── Gregorian
│   ├── Jawa
│   ├── Saka Sunda
│   ├── Bali
│   ├── Chinese Lunar
│   ├── Hijri
│   ├── Kalacakra
│   ├── Maya
│   └── Aztec
│
├── PERSONAL
│   ├── BaZi
│   ├── Weton Jawa
│   └── Candra Bhumi / Weton Sunda
│
├── TIME / ACTION
│   ├── Palintangan
│   ├── Qi Men
│   └── other verified methods
│
├── SPATIAL / HARMONY
│   ├── Feng Shui
│   └── other verified methods
│
└── NATURAL / ASTRONOMICAL
    ├── Sun
    ├── Moon
    ├── Sky
    ├── Eclipse
    ├── Earth
    ├── Tide
    └── other verified natural context
```

A missing provider or unavailable method must degrade gracefully. It must not corrupt unrelated snapshot sections.

## 7. CORE CONTEXT ARCHITECTURE

The application has distinct context classes.

### 7.1 TodayContext — temporal/live context

`TodayContext` is the SSOT for active temporal observation context.

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

It answers:

> What is the temporal and environmental context for the date, time, and location currently being inspected?

It must not become the permanent store for a user's birth identity.

### 7.2 Personal Profile Context

Personal birth/profile data is a separate conceptual context.

```text
User / Profile
    ↓
Personal Profile Context
    ↓
BaZi / Weton / Candra Bhumi / personal methods
```

Do not place birth date, birth time, birth location, or permanent personal calculation inputs into TodayContext merely for convenience.

If ProfileContext is introduced, it owns personal identity/profile state while consuming TodayContext only where current temporal context is required.

### 7.3 Location Context

Location is a shared contextual input but remains distinct from personal identity.

```text
Location
├── timezone / local date-time
├── natural observation
├── spatial/harmony calculations
└── location-sensitive traditional calculations
```

Manual location selection takes precedence over automatic geolocation.

## 8. DEPENDENCY DIRECTION

Protected dependency direction:

```text
CONTEXT
  ↓
ENGINE
  ↓
ADAPTER
  ↓
NORMALIZED RESULT
  ↓
GLOBAL SNAPSHOT / UI
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
- The dashboard must consume normalized results rather than reproduce calculations.

## 9. ENGINE / ADAPTER / REGISTRY ARCHITECTURE

The repository uses an adapter pattern.

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

1. Keep calculation in the appropriate engine/domain layer.
2. Create or extend an adapter where appropriate.
3. Normalize the result through the existing result contract.
4. Register it explicitly.
5. Consume the normalized result from UI.
6. Do not bypass the adapter merely because the UI needs one field.

Do not refactor working adapters or registry structure merely to make a new feature convenient.

## 10. CURRENT BACKEND ENGINES

Established backend engines include:

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
- `jawa_engine.py` belongs to the Jawa calendar/personal domain according to actual output.
- `palintangan_sunda_engine.py` belongs to Strategi Waktu & Aksi.
- calendar engines belong to Penanggalan.
- natural/astronomical engines provide contextual data and remain separate from traditional calendar arithmetic.

Do not infer undocumented formulas from names alone. Inspect the authoritative implementation and source material.

## 11. NATURAL LAYER — PROTECTED RECOVERY TARGET

Natural Layer is a working contextual subsystem and must be treated as protected functionality.

It includes, where implemented:

- Sky Overview
- Sun position
- Moon position and illumination
- Solar events
- Lunar events
- Eclipse context
- Earth Space
- Tide
- atmospheric/environmental providers
- weather
- geomagnetic/radiation
- air quality
- volcanic/seismic/ocean data where supported

Natural Layer is contextual data. It must not rewrite or modify calendar calculations.

### Current known issue

The current dashboard has a broken Natural Layer state after recent changes. The recovery task is to restore the previously working behavior, not to redesign Natural Layer from scratch.

Expected recovery behavior:

- identify the change that caused the break;
- recover from the last known-working implementation where possible;
- restore existing contracts;
- preserve graceful provider failure;
- validate dashboard rendering;
- do not introduce unrelated architecture changes.

Do not replace working natural engines with speculative new providers during recovery.

## 12. PARIRIMBON / PALINTANGAN BOUNDARY

Paririmbon Sunda is the knowledge/source system.

Palintangan Sunda is a calculation/method implementation layer where verified rules exist.

```text
PARIRIMBON SUNDA
│
├── source-backed knowledge
├── Naktu
├── calendar components
├── Pernaasan data
├── Watek
├── Palintangan
└── method/source status
          ↓
PALINTANGAN SUNDA ENGINE
          ↓
NORMALIZED RESULT
          ↓
GLOBAL SNAPSHOT / UI
```

Rules:

- Keep source data and calculation rules distinguishable.
- A documented data table is not automatically a formula.
- If a formula is unknown, preserve the data without inventing the derivation.
- Do not convert incomplete research into authoritative calculation.
- `Naktu` is the SSOT numeric term where the project has explicitly established it.
- `UGA KALA.pdf` remains explicitly excluded; see Source Protection.

## 13. MASTER IMPLEMENTATION ORDER

The following sequence is the default execution roadmap for the current project.

### Phase 0 — Baseline Lock

- Freeze current repository state.
- Scan actual GitHub `main`.
- Identify the change that caused Natural Layer breakage.
- Identify affected engines, routes, adapters, components, and contracts.
- Establish dashboard regression baseline.
- Do not refactor unrelated code.

**Gate:** existing dashboard behavior is understood and protected.

### Phase 1 — Restore Natural Layer

- Restore known-working Natural Layer implementation.
- Restore backend natural engines where changed.
- Restore API routes where changed.
- Restore frontend adapters/data contracts where changed.
- Restore Sky Overview.
- Restore Solar events.
- Restore Lunar events.
- Restore Earth Space.
- Restore Tide integration.
- Preserve graceful provider failure.
- Build and validate.

**Gate:** Natural Layer is functional again before Paririmbon work begins.

### Phase 2 — Lock Global Snapshot

- Audit TodayContext.
- Audit location context.
- Audit resultRegistry.
- Audit adapter contracts.
- Confirm normalized-result flow.
- Confirm dashboard does not perform domain arithmetic.
- Confirm Natural Layer is independent from calendar arithmetic.
- Confirm new methods can be added without turning the dashboard into a method-specific architecture.

**Gate:** Global Snapshot contract is stable.

### Phase 3 — Audit Paririmbon Source

- Inspect the authorized Paririmbon source material.
- Separate documented data from documented formulas.
- Identify Naktu, Watek, Pernaasan, calendar components, and other verified material.
- Mark verified, partial, and unknown sections.
- Never invent undocumented formulas.

**Gate:** Paririmbon knowledge model is locked.

### Phase 4 — Complete/Repair Paririmbon Engine

- Audit `palintangan_sunda_engine.py`.
- Implement only verified rules.
- Implement verified lookup tables.
- Keep calculation and interpretation distinct.
- Produce normalized output.
- Test known values and edge cases.

**Gate:** Paririmbon/Palintangan engine is verified.

### Phase 5 — API and Adapter

- Lock backend API input/output contract.
- Validate error handling.
- Update/create the Paririmbon adapter.
- Normalize the response.
- Register the result.
- Remove direct calculation/API coupling from UI.

**Gate:** source → engine → API → adapter → normalized result works.

### Phase 6 — Paririmbon UI

- Audit `ParirimbonPage.jsx`.
- Separate source/knowledge presentation from calculated results.
- Show source/method status.
- Consume normalized result.
- Do not calculate in UI.
- Validate loading/error states.

**Gate:** Paririmbon page is complete.

### Phase 7 — Paririmbon Global Snapshot

- Define compact Paririmbon snapshot fields.
- Register them in the Global Snapshot.
- Display them on the Global Dashboard where appropriate.
- Validate selected date, location, and profile dependencies.
- Confirm unrelated calendar/natural snapshots remain unchanged.

**Gate:** Paririmbon is integrated into the Global Dashboard.

### Phase 8 — Personal Profile Context

- Audit personal profile architecture.
- Separate birth inputs from TodayContext.
- Validate Weton.
- Validate BaZi.
- Validate Candra Bhumi/Weton Sunda.
- Define normalized personal results.
- Integrate only where the Global Snapshot requires them.

**Gate:** personal blueprint calculations are context-correct.

### Phase 9 — Method Library Expansion

Only after the core is stable, expand the method library:

- Jawa / Primbon
- Sunda / Paririmbon
- China / Chinese systems
- Bali / Wariga
- Hijri / Islamic calendar and astronomy
- Kalacakra
- Maya
- Aztec
- other explicitly verified systems

The architecture must support these systems without merging their formulas.

### Phase 10 — Global Snapshot Completion

Validate the complete dashboard as an aggregation of:

```text
Calendar
+ Personal Blueprint
+ Time / Action
+ Spatial / Harmony
+ Natural / Astronomical Context
+ Future verified methods
```

**Gate:** Cakra Langit Global Dashboard represents the integrated system without corrupting independent methods.

### Phase 11 — Final Regression

- Existing routes remain intact.
- Existing engines remain intact.
- Natural Layer remains intact.
- Paririmbon calculations remain intact.
- Adapter contracts remain intact.
- Registry remains intact.
- Dashboard snapshot remains intact.
- Profile context remains separate.
- No undocumented formula was introduced.
- Build passes.
- Relevant backend/API tests pass.
- Regression dates pass.
- Git diff is reviewed for unrelated changes.

## 14. LOCKED UX ARCHITECTURE

```text
CAKRA LANGIT
│
├── /                         PUBLIC PAGE
├── /login                    AUTHENTICATION PAGE
├── /dashboard/*              GLOBAL / PERSONAL USER EXPERIENCE
└── /saehu                    PRIVATE ADMIN CMS
```

Rules:

- `/` is the public face.
- `/login` is authentication.
- `/dashboard/*` is the authenticated Cakra Langit Global Dashboard experience.
- `/saehu` is the private admin CMS.
- `/calculation/*` is legacy and redirects to `/dashboard`.
- Do not introduce `/admin/login`.
- Do not add public admin links or menus.
- Backend role authorization is the real admin boundary.

## 15. UI ARCHITECTURE

Target separation:

```text
LAYOUT
  ↓
GLOBAL / DOMAIN PAGE
  ↓
ADAPTER / NORMALIZED RESULT
  ↓
ENGINE
```

The current physical structure may remain:

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

## 16. LOCATION POLICY

Browser geolocation is preferred when available.

- Coordinates are resolved to the nearest supported Indonesian city for user-facing location.
- Manual location selection takes precedence over automatic geolocation.
- Latitude/longitude are internal metadata unless explicitly required.
- Location resolution must not be used to infer personal identity.

## 17. DAY-BOUNDARY POLICY

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

## 18. LOCKED CALENDAR BASELINES

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

## 19. REGRESSION BASELINE

Use 27–28 August 2026 as a regression event case where applicable:

```text
27 August 2026
Jawa: Kamis Legi / 13 Mulud 1960 / Wuku Maktal
Chinese: Lunar 7/15 / Zhongyuan
Hindu: Shravana Purnima (tradition/location dependent)
Astronomy: near/full Moon period

28 August 2026:
partial lunar eclipse; project baseline says not visible from Indonesia
```

Do not collapse a calendar date and an exact astronomical event instant into one concept.

## 20. SOURCE PROTECTION

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
NORMALIZED RESULT
        ↓
GLOBAL SNAPSHOT / UI
```

If a source only documents an output but not its derivation, preserve the output as source-backed data and do not invent a formula.

## 21. VALIDATION

Before marking any implementation phase complete:

```bash
npm run build
```

Run relevant tests when available.

For backend/database changes, validate the affected API, migration, or persistence behavior as appropriate.

For architecture changes, also verify:

- existing routes remain intact;
- existing engine outputs remain intact;
- adapter contracts remain intact;
- registry contracts remain intact;
- dashboard snapshot remains intact;
- no unrelated calculation behavior changed.

A successful build is mandatory before claiming a frontend phase complete.

## 22. CHANGE SAFETY

Before editing:

1. Identify the authoritative implementation.
2. Identify dependencies and protected behavior.
3. State the proposed change and its scope.
4. Obtain approval when the change is architectural, destructive, broad, or touches locked behavior.
5. Apply only the approved change.
6. Validate and report exact results.

Do not silently expand scope.

Architecture updates do not authorize unrelated refactoring.

When recovering broken behavior, prefer restoration of the last known-working implementation over redesign.

## 23. CURRENT REPOSITORY BASELINE

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

The architectural direction is:

```text
CAKRA LANGIT
│
├── GLOBAL SNAPSHOT
│
├── 01 PENANGGALAN
├── 02 CETAK BIRU DIRI
├── 03 STRATEGI WAKTU & AKSI
├── 04 HARMONI TATA RUANG
└── NATURAL / ASTRONOMICAL CONTEXT
```

The four-layer taxonomy organizes existing and future capabilities. It does not authorize replacing working engines or inventing missing domain rules.

**Primary implementation order:**

```text
RESTORE NATURAL LAYER
        ↓
LOCK GLOBAL SNAPSHOT
        ↓
PARIRIMBON SOURCE
        ↓
PARIRIMBON ENGINE
        ↓
API
        ↓
ADAPTER
        ↓
REGISTRY
        ↓
PARIRIMBON UI
        ↓
GLOBAL DASHBOARD
        ↓
PERSONAL PROFILE
        ↓
METHOD LIBRARY EXPANSION
        ↓
FINAL GLOBAL SNAPSHOT
        ↓
REGRESSION / BUILD
```


## 24. CURRENT EXECUTION CHECKPOINT

Phase 2 — **LOCK GLOBAL SNAPSHOT** is now locked on GitHub `main`.

Validated baseline:

```text
TodayContext
    ↓
Natural / Calendar context
    ↓
Engine
    ↓
Adapter
    ↓
Result Registry
    ↓
Global Snapshot / Dashboard
```

Protected conclusions:

- `TodayContext` remains the temporal/live context boundary.
- Personal birth/profile inputs remain conceptually separate from `TodayContext`.
- Location remains shared context, not personal identity.
- Calendar and natural calculations remain independent.
- Natural Layer consumes normalized registry results and does not perform domain arithmetic.
- Dashboard composition consumes normalized results rather than reproducing engine formulas.
- New methods must integrate through the engine → adapter → registry path.
- Missing providers/methods must degrade without corrupting unrelated snapshot sections.

Current execution gate:

```text
[✓] Phase 0 — Baseline Lock
[✓] Phase 1 — Restore Natural Layer
[✓] Phase 2 — Lock Global Snapshot
[ ] Phase 3 — Audit Paririmbon Source
```

This checkpoint is a lock, not permission for unrelated refactoring. The next approved scope is the Paririmbon source audit only.


## 25. PARIRIMBON SOURCE AUDIT — 27 SEP 2026

Phase 3 source audit was performed against the authorized primary source:

`PARIRIMBON SUNDA (JAWA BARAT).pdf`

The source audit confirms the following.

### Source-backed / verified data

| Domain | Finding | Source location |
|---|---|---|
| Naktu Pasaran | Kaliwon/Keliwon = 8; Manis = 5; Pahing = 9; Pon = 7; Wage = 4 | naskah p.52 and p.36 |
| Pernaasan | 12 monthly lookup rows are explicitly documented | naskah p.67 / p.21 |
| Watek Patokan | 12 month-to-Watek mappings are explicitly documented | naskah p.71 / p.36 |
| Gagalang Pasaran | Five-stage direction rotation is explicitly documented | naskah p.70–71 / p.36 |
| Gagalang Poe | 12 month-to-weekday/Watek mappings are explicitly documented | naskah p.70–71 |
| Monthly Kala groups | Four monthly groups, pantangan, keselamatan, and rizki direction are documented | naskah p.21 / p.68–69 |

### Important source discrepancy

The repository currently contains an incorrect/incomplete Pernaasan row for **Sawal**:

- Primary source: **2 - 1 - 20**.
- Current frontend table: **— / — / —**.
- Current engine table: **[]**.

This is a source-data defect and must be repaired from the primary source before the Paririmbon engine is considered complete.

### Important source ambiguity

For the fourth monthly Kala group (Sawal, Dulkaidah, Rayagung), the primary source contains two nearby descriptions:

- naskah p.67–68 states safety on **Monday and Tuesday**;
- naskah p.79 summarizes the group as safety on **Monday**.

Therefore the engine must not silently choose one interpretation and label it universally verified. Preserve the source discrepancy until the rule is explicitly resolved.

### Protected / not verified as formula

- Pernaasan formation formula: source explicitly says the author did not obtain the method; lookup data may be used, but no generation formula may be invented.
- Jaya / Apes: the current repository contains a Cakra Langit reconstruction marked `CAKRA_LANGIT_RECONSTRUCTED`; this is **not** a verified manuscript formula and must not be promoted to VERIFIED.
- Pancasuda Universal, Kala Alit, Kala Ageung: remain NOT LOCKED.
- Watek Jam full interval model: remains PARTIAL.

### Source-policy result

The authorized source is sufficient to lock the documented lookup data above, but it is **not** sufficient to authorize undocumented derivation formulas. The next phase is a targeted engine repair/audit, beginning with the Sawal Pernaasan source-data defect and preserving unresolved source ambiguities.

Current execution gate:

```text
[✓] Phase 0 — Baseline Lock
[✓] Phase 1 — Restore Natural Layer
[✓] Phase 2 — Lock Global Snapshot
[✓] Phase 3 — Audit Paririmbon Source
[ ] Phase 4 — Complete/Repair Paririmbon Engine
```
