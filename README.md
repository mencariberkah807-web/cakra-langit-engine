# Cakra Langit

Personal Almanac: a unified user experience for calendars, natural phenomena, traditional systems, and astronomical context.

## Current Baseline

The current application architecture separates public, authentication, personal-user, admin, and domain/engine concerns.

```text
CAKRA LANGIT
│
├── /                         Public Page
│   └── public visual SSOT
│
├── /login                    Authentication boundary
│
├── /dashboard/*              Personal / User Page
│
└── /saehu                    Private Admin CMS entry
```

Legacy `/calculation/*` routes redirect to `/dashboard`. The calculation/engine layer remains a protected domain implementation and is not a user-facing route.

## Architecture

```text
src/
├── app/                       App and routing
├── layouts/                   Public / Auth / User layouts
├── components/                Reusable UI primitives
├── public/                    Public page and shared Cakra presentation
├── auth/                      Authentication and user dashboard
└── domain/                    Natural, calendar, weton, BaZi, paririmbon

backend/
├── routes/                    API boundaries
├── services/                  Application services
├── database/                  Models and persistence
├── engines/                   Protected calculation engines
└── alembic/                   Database migrations
```

The engine/domain layer is protected. UI work must consume domain output through the established adapters/data layer rather than moving calculation logic into presentation code.

## Change-Control Policy

All repository work follows:

```text
SCAN → IDENTIFY → PROPOSE → APPROVE → APPLY → VALIDATE
```

Preserve working behavior. Do not perform broad cleanup, refactoring, renaming, or engine rewrites without explicit approval.

## Locked Domain Rules

- Calendar engines remain independent.
- Engine-specific day boundaries must be preserved.
- Kalacakra is protected; known anchor: `17 August 2024 12:00 = Tanggal 1 / I`.
- Saka Sunda / Surya Kala baseline is protected; known anchor: `1 Kasa 1934 = 22 December 2011`.
- Natural engines do not modify calendar calculations.
- Astronomical event instants must not be conflated with calendar dates.

## Location

Browser geolocation is preferred when available. Coordinates are resolved to the nearest supported Indonesian city for user-facing location. Manual location selection takes precedence over automatic geolocation.

## Admin CMS

Admin access is intentionally entered through `/saehu`; there is no public admin menu/link. The backend `role=admin` authorization is the actual security boundary.

Current CMS scope:

- Brand: site name, tagline, logo, favicon
- Public Hero: image, title, description, CTA labels
- Feature Highlights: four title/description pairs
- Login: login image
- SEO: page title and meta description

## Validation

A completed implementation must be validated with the smallest relevant checks, including:

```bash
npm run build
```

and applicable backend/database validation. Do not claim a feature works without validation.

## Important Source Rule

`UGA KALA.pdf` is explicitly excluded from the project's source of truth, reference material, rules, and calculations. Do not use it.
