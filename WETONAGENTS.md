# Cakra Langit — Weton Agents Baseline

## 1. Product Identity

Canonical product name: **Cakra Langit**.

Do not use **Personal Almanac** as the product identity in new UI/UX, documentation, agent output, or feature naming. Treat it as legacy terminology.

Product positioning:

> **Cakra Langit — Harmoni Langit Panduan Kehidupan**

Cakra Langit helps users understand time, nature, and self through traditional calendar systems and modern astronomy.

---

## 2. Weton Philosophy

Weton Jawa is presented as **panduan kehidupan**, not as a deterministic fortune-telling machine.

Preferred framing:

- panduan
- pitutur
- bahan pertimbangan
- kecenderungan
- pengetahuan tradisional
- warisan pengetahuan leluhur

Do not turn traditional interpretations into guaranteed predictions about the future.

Do not dismiss, rewrite, or replace the traditional worldview merely because modern terminology differs.

Core principle:

> **Preserve the tradition. Document the method. Separate calculation from interpretation.**

---

## 3. Agent Scope

This agent is specifically for **Weton Jawa** inside Cakra Langit.

### Explicitly outside Weton scope

- Bali / Palelintangan
- BaZi
- Caka Sunda
- Kalacakra
- unrelated astronomical engines
- unrelated calendar systems

These systems may coexist elsewhere in Cakra Langit, but must not be mixed into Weton calculation or interpretation.

Never use Bali/Palelintangan as a Weton source.

---

## 4. Full Weton Scope

The target is a complete Weton Jawa reading, not only the weekday/pasaran pair.

### Core Weton

- Dina
- Neptu Dina
- Pasaran
- Neptu Pasaran
- Total Neptu
- Weton

### Kalender Jawa

- Tanggal Jawa
- Tahun Jawa
- Wuku
- Pawukon / day-in-Wuku
- Windu
- Kurup
- Lambang
- effective date
- sunset boundary

### Petungan Jawa

- Pancasuda
- Pangarasan
- Rakam
- other validated Jawa petungan methods

### Reading layers

- Watak / Karakter
- Rezeki
- Asmara
- Kesehatan
- Pranata Mangsa
- Analisis Kitab
- other validated traditional interpretation layers

Examples of Analisis Kitab include:

- Dina Ala
- Kala Tinantang
- Tibo Loro
- other validated methods

---

## 5. Architecture Protection

Existing logic, calculation engines, domain behavior, adapters, contracts, and data flow are protected.

UI/UX and visual presentation may evolve, but protected calculation/domain behavior must not be changed without explicit approval.

### Do not

- create a universal calculation engine
- move domain calculations into presentation components for convenience
- rewrite an existing Jawa engine merely to simplify UI
- alter adapters or contracts without explicit approval
- mix Weton calculation with another calendar engine

When a requested UI change encounters calculation/domain logic:

> Preserve the existing logic and change presentation only unless explicit approval is given.

Architecture principle:

> **Same Logic. New Experience.**

---

## 6. Existing Jawa Calculation Baseline

The existing Jawa engine remains the calculation source of truth unless explicitly superseded through a validated source and approved change.

### Dino Neptu

| Dina | Neptu |
|---|---:|
| Senen | 4 |
| Selasa | 3 |
| Rebo | 7 |
| Kemis | 8 |
| Jemuwah | 6 |
| Setu | 9 |
| Ngahad | 5 |

### Pasaran Neptu

| Pasaran | Neptu |
|---|---:|
| Legi | 5 |
| Pahing | 9 |
| Pon | 7 |
| Wage | 4 |
| Kliwon | 8 |

The existing engine also supplies Jawa calendar context including Weton, Wuku, Tahun, Kurup, Windu, Lambang, effectiveDate, and sunset boundary.

Do not duplicate or independently reimplement these calculations in the UI.

---

## 7. Petungan Provenance Rules

Existing implementations are not automatically the universal or historically authoritative version of a method.

For every petungan method, distinguish:

1. implemented formula
2. source/provenance
3. traditional interpretation
4. source variants
5. validation status

Never fabricate a formula.

Never silently merge conflicting source variants.

If a requested method is not sufficiently supported by an approved source:

> Mark it as **unverified** rather than inventing a result.

### Current implementation examples

#### Pancasuda

Current implementation uses:

`total % 5 || 5`

with:

1. Sri
2. Lungguh
3. Gedhong
4. Lara
5. Pati

This must not automatically be represented as the only authoritative Pancasuda tradition.

#### Pangarasan

The current implementation contains a direct total-neptu mapping. Preserve the existing calculation unless a validated and explicitly approved replacement is provided.

#### Rakam

The current implementation uses Dino Kupih + Pasaran Kupih and maps the result to six Rakam values. Preserve the implementation and distinguish it from source claims until provenance is explicitly validated.

---

## 8. Source & Preservation Principles

Weton is treated as a **digital preservation layer / living archive**.

Preserve:

- original terminology
- calculation methods
- source provenance
- variants between sources
- distinction between calculation and interpretation

The agent is a documentation and presentation layer for traditional knowledge, not an authority that decides whether the tradition is true or false.

When sources disagree, document the disagreement rather than silently selecting one version.

---

## 9. Shared Birth Profile Boundary

The shared birth profile stores context/input for birth-based systems.

Fields:

- display name
- email
- birth date
- birth time
- birth time unknown
- birth location
- birth timezone

The profile is input/context. Each domain engine remains responsible for its own calculation.

Do not claim that profile data automatically feeds every engine unless that integration is actually implemented.

---

## 10. Weton UI/UX Baseline

Weton is part of the same Cakra Langit product and must use the Cakra Langit visual language.

Visual direction:

- dark celestial
- deep navy / near-black surfaces
- calm, low-contrast presentation
- restrained cyan/blue accents
- restrained gold where appropriate
- no excessive neon
- comfortable for long viewing
- subtle borders
- controlled glow
- clear typography hierarchy

Weton should feel like an extension of the Cakra Langit dashboard, not a separate Primbon application.

Language:

- headings/titles may use English where consistent with the product system
- Weton user-facing explanatory text should use neutral Indonesian
- avoid unnecessary Sundanese greetings on the Jawa Weton page

---

## 11. Current Weton Page Structure

The current Weton experience is organized around:

```text
01 · Core             02 · Calendar

03 · Symbol           04 · Petungan

05 · Reading Layers
```

### Core

The Core area uses two cards:

- Weton Personal
- Dina / Pasaran / Neptu Dina / Neptu Pasaran / Total Neptu

### Profil Kelahiran

The page can expose the shared birth context:

- Tanggal
- Waktu
- Lokasi

### Fitur Jawa Lainnya

Quick feature cards are **not** anchors to Core/Calendar/Symbol/Petungan.

They represent other Jawa features/methods, for example:

- Kecocokan Jodoh
- Arah Rejeki
- Pal Laduni
- Kalender Jawa

Do not imply that these features are implemented until their actual implementation exists.

---

## 12. Interpretation Safety & Semantics

Traditional Weton interpretations may be presented faithfully as traditional interpretations, but wording must avoid deterministic guarantees.

Prefer:

- "dalam tradisi..."
- "menurut metode..."
- "dipandang sebagai..."
- "menjadi bahan pertimbangan..."
- "menggambarkan kecenderungan..."
- "pitutur..."

Avoid presenting a traditional calculation as scientifically established fact.

At the same time, do not overburden the interface with repetitive disclaimers. Preserve the cultural context while maintaining clear provenance.

---

## 13. Change-Control Policy

### Allowed without changing domain behavior

- UI layout
- visual styling
- spacing
- typography
- card composition
- labels/copy refinement
- presentation of already-existing calculation results
- navigation/presentation improvements

### Requires explicit approval

- changing Jawa calculation formulas
- changing domain behavior
- changing adapters
- changing contracts
- changing data flow
- introducing a new calculation engine
- replacing an existing calculation source
- mixing another traditional calendar system into Weton

### Required before adding a new traditional method

- identify source
- document terminology
- document formula/method
- identify known variants
- distinguish calculation from interpretation
- validate before presenting as authoritative

---

## 14. Agent Decision Rule

When uncertain, follow this order:

```text
1. Protect existing logic
2. Check source/provenance
3. Preserve original terminology
4. Separate calculation from interpretation
5. Document variants instead of guessing
6. Keep Weton strictly Jawa
7. Present as panduan kehidupan
8. Apply Cakra Langit visual language
```

If a request conflicts with these rules, do not silently implement the conflicting behavior. State the conflict and request explicit approval where required.

---

## 15. Master Principle

> **Bangun Weton Jawa sebagai pengetahuan tradisional yang terdokumentasi dan dapat dipahami dalam Cakra Langit — preserve the source, preserve the calculation, separate method from interpretation, and present it as panduan kehidupan tanpa mengubah atau mencampurkan engine yang terlindungi.**
