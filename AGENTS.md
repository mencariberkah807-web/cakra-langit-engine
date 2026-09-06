# AGENTS.md

# PERSONAL ALMANAC — TERMINAL-FIRST AGENT PLAYBOOK

> This file is the operational contract for any AI agent working on this repository.
>
> The agent must use the terminal to inspect, implement, validate, and build the project.
>
> Do not guess the repository state.
>
> **Inspect first. Change second. Validate always.**

---

# 0. PRIMARY EXECUTION LOOP

Every task follows this loop:

```text
READ
  ↓
TERMINAL CHECK
  ↓
SCAN
  ↓
IDENTIFY
  ↓
PLAN
  ↓
APPROVAL (when required)
  ↓
IMPLEMENT
  ↓
TEST
  ↓
BUILD
  ↓
REGRESSION CHECK
  ↓
REPORT
```

The agent must never jump directly from a user request to editing files without first determining the actual repository state.

---

# 1. PROJECT IDENTITY

**Project:** Personal Almanac

The system presents one moment through multiple independent calendar systems and natural phenomena.

Core conceptual flow:

```text
DateTime
+
Location
+
Timezone
        ↓
      CORE
        ↓
 ┌──────┴──────┐
 ↓             ↓
CALENDAR      NATURAL
ENGINES       ENGINES
 ↓             ↓
 └──────┬──────┘
        ↓
     ADAPTERS
        ↓
    NORMALIZED
      OUTPUT
        ↓
    DASHBOARD
```

The project is not a simple date converter.

---

# 2. TERMINAL RULES

The terminal is the source of truth for repository state.

Before implementation, run:

```bash
pwd
```

Then:

```bash
find . -maxdepth 3 -type f | sort
```

Inspect the root:

```bash
ls -la
```

Inspect package configuration:

```bash
cat package.json
```

Inspect Git state when Git exists:

```bash
git status --short
git branch --show-current
```

If a command fails, do not assume why.

Inspect the error and resolve the actual cause.

---

# 3. FIRST-RUN BOOTSTRAP

From the repository root:

```bash
pwd
ls -la
test -f package.json && echo "package.json OK"
test -f AGENTS.md && echo "AGENTS.md OK"
test -f vite.config.js && echo "vite.config.js OK"
test -f index.html && echo "index.html OK"
```

Install dependencies:

```bash
npm install
```

Check Node:

```bash
node --version
npm --version
```

Verify dependency tree:

```bash
npm ls --depth=0
```

Run development server:

```bash
npm run dev
```

The agent must confirm that Vite starts successfully before claiming the runtime is working.

---

# 4. STANDARD REPOSITORY SCAN

Before touching any feature, scan relevant files.

Basic scan:

```bash
find src -type f | sort
```

Search imports:

```bash
grep -R "from " -n src
```

Search exports:

```bash
grep -R "export " -n src
```

Search TODO/FIXME:

```bash
grep -R -nE "TODO|FIXME|XXX|HACK" src tests 2>/dev/null || true
```

Search a symbol:

```bash
grep -R -n "SYMBOL_NAME" src tests
```

Inspect a file:

```bash
sed -n '1,240p' path/to/file
```

Inspect only a range:

```bash
sed -n '120,220p' path/to/file
```

The agent must inspect the relevant implementation before modifying it.

---

# 5. PROJECT ARCHITECTURE

```text
personal-almanac/
├── AGENTS.md
├── README.md
├── package.json
├── vite.config.js
├── index.html
│
├── config/
├── docs/
├── public/
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   │
│   ├── core/
│   │   ├── context.js
│   │   ├── location.js
│   │   ├── time.js
│   │   └── TodayContext.jsx
│   │
│   ├── adapters/
│   │   └── adapterContract.js
│   │
│   ├── data/
│   ├── services/
│   ├── utils/
│   │
│   ├── engines/
│   │   ├── calendar/
│   │   │   ├── gregorian/
│   │   │   ├── jawa/
│   │   │   ├── saka-sunda/
│   │   │   ├── candra-kala-sunda/
│   │   │   ├── bali/
│   │   │   ├── chinese-lunar/
│   │   │   ├── hijri/
│   │   │   └── kalacakra/
│   │   │
│   │   └── natural/
│   │       ├── sun/
│   │       ├── moon/
│   │       ├── eclipse/
│   │       ├── sky/
│   │       ├── stars/
│   │       ├── tide/
│   │       ├── atmosphere/
│   │       ├── earth/
│   │       └── seasonal/
│   │
│   ├── dashboard/
│   │   ├── AppShell.jsx
│   │   ├── today/
│   │   ├── timeline/
│   │   ├── calendar-detail/
│   │   └── settings/
│   │
│   └── styles/
│       └── global.css
│
└── tests/
    ├── unit/
    ├── integration/
    └── regression/
```

---

# 6. CORE CONTEXT RULE

The shared context conceptually contains:

```js
{
  time: {
    instant,
    timestamp
  },

  location: {
    city,
    province,
    country,
    timezone,
    timezoneLabel,
    latitude,
    longitude,
    elevation
  }
}
```

User-facing location is:

```text
City
Province
Country
```

Latitude and longitude are internal metadata.

The agent must not expose latitude/longitude as mandatory user input unless explicitly requested.

---

# 7. TIMEZONE POLICY

Indonesia support:

```text
WIB  = UTC+7
WITA = UTC+8
WIT  = UTC+9
```

Search timezone handling:

```bash
grep -R -nE "timezone|WIB|WITA|WIT|UTC" src
```

User-facing times should use local time.

UTC may be used internally for astronomical computation and event normalization.

---

# 8. DAY BOUNDARY POLICY

There is no global calendar boundary.

Supported models:

```text
MIDNIGHT
SUNSET
SUNRISE
FIXED_TIME
ENGINE_SPECIFIC
```

Each engine owns its own effective-date rule.

Conceptually:

```js
resolveEffectiveDate(context);
```

Examples:

```text
Gregorian
→ midnight

Jawa
→ sunset

Kalacakra
→ protected engine-specific behavior
```

Never globally force:

```text
all engines = midnight
```

Before changing boundary logic, search:

```bash
grep -R -nE "boundary|sunset|sunrise|effectiveDate|Maghrib" src
```

---

# 9. ENGINE PROTECTION RULE

Calendar engines are independent domain modules.

Never merge:

```text
Jawa
+
Saka Sunda
+
Hijri
+
Chinese Lunar
```

into one shared date algorithm.

Correct architecture:

```text
ENGINE
   ↓
ADAPTER
   ↓
NORMALIZED RESULT
   ↓
DASHBOARD
```

Incorrect architecture:

```text
ALL ENGINE LOGIC
       ↓
   App.jsx
       ↓
    UI
```

Before modifying an engine:

```bash
find src/engines -type f | sort
grep -R -n "ENGINE_NAME" src
```

If the engine is protected or externally imported, do not refactor it during integration.

Build an adapter.

---

# 10. ADAPTER CONTRACT

Normalized calendar result:

```js
{
  id: "calendar-id",
  title: "Calendar Name",

  primary: "",
  secondary: "",

  details: [],

  effectiveDate: "",
  boundary: "ENGINE_SPECIFIC",

  events: [],

  meta: {}
}
```

Before creating an adapter:

```bash
sed -n '1,260p' src/adapters/adapterContract.js
```

Search existing adapters:

```bash
find src/adapters -type f -maxdepth 2 | sort
```

Adapter responsibility:

```text
ENGINE OUTPUT
      ↓
READ / EXTRACT
      ↓
NORMALIZE
      ↓
DASHBOARD RESULT
```

The adapter must not silently alter domain results.

---

# 11. DASHBOARD RULE

Dashboard code may:

- render normalized results;
- sort cards;
- group events;
- display details;
- display timeline entries.

Dashboard code must not:

- calculate calendar arithmetic;
- alter effective dates;
- override engine boundaries;
- invent astronomical values.

Before editing dashboard:

```bash
find src/dashboard -type f | sort
grep -R -nE "calculate|Date\\(|sunset|boundary|resolve" src/dashboard
```

If domain calculations are found in dashboard code, identify them before moving anything.

Do not perform broad cleanup without approval.

---

# 12. NATURAL ALMANAC DOMAINS

Natural engines:

```text
sun/
moon/
eclipse/
sky/
stars/
tide/
atmosphere/
earth/
seasonal/
```

Target responsibilities:

## Sun

```text
sunrise
sunset
solar noon
twilight
day length
solar declination
equation of time
hari tanpa bayangan
golden hour
blue hour
equinox
solstice
```

## Moon

```text
phase
illumination
age
moonrise
transit
moonset
altitude
azimuth
distance
perigee
apogee
```

## Eclipse

```text
solar eclipse
lunar eclipse
start
maximum
end
magnitude
visibility
```

## Sky

```text
meteor showers
planets
conjunctions
occultations
close approaches
```

## Stars

```text
constellations
major stars
rise/set
Milky Way visibility
```

## Tide

```text
high tide
low tide
height
range
spring tide
neap tide
```

## Atmosphere

```text
temperature
humidity
cloud cover
visibility
rain
wind
UV
air quality
lightning
```

## Earth

```text
earthquake
volcano
tsunami warning
geomagnetic storm
```

## Seasonal

```text
astronomical season
monsoon
wet/dry season
ecological markers
```

Natural engines never modify calendar calculations.

---

# 13. CALENDAR INTEGRATION PROCEDURE

Integrate one engine at a time.

For every engine:

## STEP A — SCAN

```bash
find src/engines/calendar/ENGINE_NAME -type f | sort
```

If importing from another location:

```bash
find .. -type f | grep -i "ENGINE_NAME"
```

Inspect candidate files:

```bash
sed -n '1,260p' path/to/engine-file
```

## STEP B — IDENTIFY

Determine:

```text
Input
Output
Anchor
Boundary
Dependencies
Protected behavior
```

## STEP C — CREATE ADAPTER

Example:

```text
src/adapters/ENGINE_NAME.adapter.js
```

## STEP D — TEST

Test known anchor before UI integration.

## STEP E — CONNECT

Connect adapter to dashboard.

## STEP F — REGRESSION

Confirm existing engines remain unchanged.

---

# 14. LOCKED BASELINE — SAKA SUNDA / SURYA KALA

Application anchor:

```text
1 Kasa 1934
=
22 December 2011 Gregorian
```

Year rules:

```text
Wastu = 365 days
Wuntu = 366 days

Leap:
year divisible by 4

Exception:
year divisible by 128
returns to Wastu
```

Month structure:

```text
Kasa        30
Karo        31
Katiga      30
Kapat       31
Kalima      30
Kanem       31
Kapitu      30
Kawalu      31
Kasanga     30
Kadasa      31
Hapitlemah  30
Hapitkayu   30 / 31
```

Extra day belongs to Hapitkayu during Wuntu.

Do not alter this baseline without explicit approval.

---

# 15. LOCKED BASELINE — KALACAKRA

Known application anchor:

```text
17 August 2024
12:00
=
Tanggal 1 / I Kalacakra
```

The existing Kalacakra engine is protected.

Integration method:

```text
KEEP ENGINE
+
CREATE ADAPTER
+
VALIDATE OUTPUT
```

Do not rewrite protected behavior for UI convenience.

---

# 16. REGRESSION EVENT BASELINE

Use 27–28 August 2026 as an event regression case.

Baseline:

```text
Gregorian
27 August 2026

Jawa
Kamis Legi
13 Mulud 1960
Wuku Maktal

Chinese
Lunar 7/15
Zhongyuan / Hungry Ghost Festival

Hindu
Shravana Purnima
Location / tradition dependent

Astronomy
Near / Full Moon period

Lunar Eclipse
Partial Lunar Eclipse on 28 August 2026
Project baseline: not visible from Indonesia
```

Do not collapse:

```text
calendar date
```

and:

```text
exact astronomical event instant
```

into one concept.

---

# 17. TESTING POLICY

Before claiming a feature works:

```bash
npm run build
```

If tests exist:

```bash
npm test
```

If no test script exists, inspect:

```bash
cat package.json
```

Then create or run the smallest appropriate validation.

Useful checks:

```bash
find tests -type f | sort
```

Syntax/import scan:

```bash
npm run build
```

A successful build is mandatory before a phase is marked complete.

---

# 18. REQUIRED TEST MATRIX FOR NEW ENGINE

Every calendar engine requires:

```text
[ ] Anchor test
[ ] Known-date test
[ ] Forward calculation
[ ] Backward calculation
[ ] Boundary test
[ ] Month rollover
[ ] Year rollover
```

Where applicable:

```text
[ ] Location test
[ ] Timezone test
[ ] Sunset/sunrise transition
[ ] Astronomical event-time test
```

---

# 19. SAFE IMPLEMENTATION WORKFLOW

For a normal feature:

```bash
# 1. inspect
git status --short 2>/dev/null || true
find src -type f | sort

# 2. search relevant symbols
grep -R -n "FEATURE_OR_SYMBOL" src tests 2>/dev/null || true

# 3. inspect target
sed -n '1,260p' path/to/target

# 4. implement only after identification
```

After editing:

```bash
git diff -- src
```

Inspect the exact change.

Then:

```bash
npm run build
```

If successful:

```bash
git diff --check
```

Final repository check:

```bash
git status --short 2>/dev/null || true
```

---

# 20. CHANGE CONTROL

Default protocol:

```text
SCAN
→
IDENTIFY
→
PROPOSE
→
APPROVE
→
APPLY
→
VALIDATE
```

Approval is required for:

- rewriting protected engine logic;
- changing anchors;
- changing calendar boundary rules;
- replacing an algorithm;
- changing project architecture;
- deleting working code;
- broad refactors;
- dependency replacement that affects existing behavior.

Direct implementation is allowed when the user explicitly says:

```text
apply
langsung
implement
mulai implementasi
langsung upgrade
fix
```

Even with direct implementation, the agent must still:

```text
SCAN
→ IDENTIFY
→ APPLY
→ VALIDATE
```

---

# 21. FILE EDITING RULE

Before overwriting a file:

```bash
sed -n '1,260p' path/to/file
```

Do not overwrite an unknown file blindly.

For small edits, prefer targeted modifications.

After every modification:

```bash
git diff -- path/to/file
```

If Git is unavailable:

```bash
diff -u path/to/file.backup path/to/file
```

Use temporary backups before risky manual transformations:

```bash
cp path/to/file path/to/file.backup
```

Remove temporary backups only after validation.

---

# 22. DEPENDENCY RULE

Before adding a dependency:

```bash
cat package.json
npm ls --depth=0
```

Do not install duplicate libraries.

Do not replace an existing working dependency without approval.

After installation:

```bash
npm install PACKAGE_NAME
npm ls PACKAGE_NAME
npm run build
```

If a package is only needed for one engine, keep its integration isolated.

---

# 23. DEVELOPMENT SERVER PROCEDURE

Start:

```bash
npm run dev
```

For explicit host access when needed:

```bash
npm run dev -- --host 0.0.0.0
```

If port is occupied:

```bash
lsof -i :5173 2>/dev/null || true
```

Do not kill unrelated processes.

If necessary, use another port:

```bash
npm run dev -- --port 5174
```

---

# 24. BUILD PROCEDURE

Standard release validation:

```bash
rm -rf dist
npm run build
```

Inspect output:

```bash
find dist -maxdepth 2 -type f | sort
```

Optional preview:

```bash
npm run preview
```

A build failure must be resolved before marking implementation complete.

---

# 25. FINAL VALIDATION COMMAND SEQUENCE

Before saying:

```text
WORKS
DONE
COMPLETE
READY
```

Run:

```bash
echo "=== ROOT ==="
pwd
ls -la

echo "=== STATUS ==="
git status --short 2>/dev/null || true

echo "=== SOURCE ==="
find src -type f | sort

echo "=== BUILD ==="
npm run build

echo "=== DIFF CHECK ==="
git diff --check 2>/dev/null || true
```

Then report:

```text
Changed files
Validation result
Build result
Known limitations
Next safe step
```

Never claim completion based only on code generation.

---

# 26. PHASE EXECUTION ROADMAP

## PHASE 1 — FOUNDATION

```text
[✓] Project root
[✓] AGENTS.md
[✓] React + Vite structure
[✓] Core context
[✓] Today context
[✓] Default location
[✓] App Shell
[✓] Adapter contract
[✓] Calendar slots
[✓] Natural Almanac slots
```

Required terminal validation:

```bash
npm install
npm run build
```

---

## PHASE 2 — CORE CONTEXT HARDENING

```text
[ ] Selected date
[ ] Historical mode
[ ] Future mode
[ ] Location resolver
[ ] City → Province → Country
[ ] WIB/WITA/WIT normalization
[ ] Context tests
```

---

## PHASE 3 — FIRST CALENDAR INTEGRATION

Recommended first integration:

```text
Gregorian
→ adapter
→ normalized result
→ dashboard card
```

Then protected engines:

```text
Saka Sunda
→ adapter
→ regression test

Kalacakra
→ adapter
→ regression test
```

Then:

```text
Jawa
Hijri
Bali
Chinese Lunar
Candra Kala Sunda
```

One engine at a time.

---

## PHASE 4 — NATURAL ALMANAC FOUNDATION

Priority:

```text
1. Sun
2. Moon
3. Eclipse
4. Sky
5. Earth-space cycles
6. Tide
7. Atmosphere
8. Geophysical events
9. Seasonal markers
```

---

## PHASE 5 — DAILY TIMELINE

Timeline must support:

```text
00:00
Gregorian boundary

Sunrise

Solar noon

Sunset

Calendar boundary transitions where applicable

Moonrise

Night sky events
```

Timeline events must preserve exact event time and timezone.

---

## PHASE 6 — HISTORICAL / FUTURE EXPLORER

Changing the selected datetime must recompute:

```text
Calendar engines
Natural engines
Timeline
Events
```

Never reuse stale Today results.

---

## PHASE 7 — SETTINGS

Potential settings:

```text
Primary location
Visible calendars
Visible natural layers
Clock format
Language
Detail level
```

Hidden engines remain available.

---

# 27. AGENT DECISION TABLE

| Situation                              | Required Action                       |
| -------------------------------------- | ------------------------------------- |
| Unknown repository state               | Terminal scan                         |
| Existing working engine                | Protect + adapter                     |
| User says apply/fix/mulai implementasi | Scan → Apply → Validate               |
| Anchor change                          | Stop and request approval             |
| Boundary rule change                   | Stop and request approval             |
| New UI card                            | Inspect dashboard, implement, build   |
| New dependency                         | Inspect package.json first            |
| Build fails                            | Debug actual error                    |
| Test fails                             | Identify regression before proceeding |
| Conflicting calendars                  | Show both; do not force consensus     |
| Location-dependent result              | Preserve location/timezone context    |

---

# 28. NON-NEGOTIABLE PROHIBITIONS

The agent must never:

```text
❌ Guess file contents
❌ Overwrite protected engines blindly
❌ Refactor unrelated code during integration
❌ Change calendar anchors casually
❌ Force all calendars to midnight
❌ Put domain arithmetic inside dashboard components
❌ Hide disagreement between independent systems
❌ Claim “works” without validation
❌ Claim build success without running build
❌ Delete working code without approval
❌ Replace an engine merely because a cleaner implementation exists
```

---

# 29. DEFINITION OF DONE

A task is done only when all applicable conditions are true:

```text
[ ] Repository scanned
[ ] Relevant files identified
[ ] Protected behavior preserved
[ ] Requested change implemented
[ ] Diff inspected
[ ] Build succeeds
[ ] Relevant tests pass
[ ] Regression checked
[ ] No unrelated files changed
[ ] Result reported clearly
```

---

# 30. AGENT START COMMAND

When beginning any task, execute conceptually:

```bash
pwd
ls -la
test -f AGENTS.md && echo "AGENTS loaded"
test -f package.json && echo "Node project detected"
git status --short 2>/dev/null || true
find src -maxdepth 3 -type f | sort
```

Then read the relevant implementation:

```bash
sed -n '1,260p' RELEVANT_FILE
```

Only then proceed.

---

# 31. MASTER PRINCIPLE

The repository is the current technical truth.

The user request defines the objective.

`AGENTS.md` defines the operating constraints.

Terminal validation determines whether implementation actually works.

Therefore:

```text
DO NOT GUESS
DO NOT OVERWRITE BLINDLY
DO NOT BREAK WORKING ENGINES

SCAN
→ IDENTIFY
→ IMPLEMENT
→ VALIDATE
→ BUILD
→ REPORT
```

# END OF AGENTS.md

---

# PERSONAL ALMANAC V1 — ENGINE FOUNDATION LOCK

## Current Development Phase

The project is currently in:

**ENGINE FOUNDATION / DOMAIN IMPLEMENTATION**

The project is NOT currently in a UI/UX redesign phase.

The existing dashboard is considered an:

- integration surface
- debugging surface
- domain result visualization surface

It is not the current architecture target for redesign.

Do not initiate UI redesign unless explicitly requested.

---

## Architecture Direction

The required flow is:

```text
Context
    ↓
Core Time / Location
    ↓
Domain Engine
    ↓
Adapter
    ↓
Adapter Contract
    ↓
Result Registry
    ↓
Dashboard Integration
```
