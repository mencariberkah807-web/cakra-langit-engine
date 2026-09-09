# Sky Overview UI Lock

Status: **LOCKED**

## Visual baseline

The Cakra Langit `Sky Overview` card uses the approved dark celestial HUD direction:

- large central Sun/Moon polar observation workspace
- deep navy / near-black surface with restrained cyan-blue atmosphere
- gold reserved for solar emphasis; cool blue/cyan for lunar/sky emphasis
- live observation badge and current-position metadata
- Solar Events and Lunar Events presented as structured secondary panels
- glass-like borders, controlled glow, strong typography hierarchy, and restrained motion
- responsive composition: observation workspace remains primary; secondary context collapses below on narrower screens

## Protected boundary

This lock applies to **UX/UI and visual presentation only**.

The following remain protected and must not be changed as part of this redesign unless explicitly approved:

- calculation engines
- domain rules and behavior
- adapters and adapter contracts
- data flow and existing data sources
- existing event calculations
- navigation hrefs and routing behavior
- component behavior and callbacks

Implementation must re-compose existing data visually rather than inventing or recalculating domain values.

## Reference

Based on `PROPOSAL — Cakra Langit UX/UI Redesign v1` and the approved Sky Overview visual reference.
