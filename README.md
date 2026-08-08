# PokeChamPrep

A small local website to help visualize Pokémon Champions prep while building teams for Master Ball-ish ladder/tournament practice.

## What it does

- Pulls Smogon Champions Pokémon index data.
- Pulls July 2026 Reg M-B Showdown usage + chaos summaries when available.
- Builds a static dashboard in `docs/`.
- Highlights top meta Pokémon, weighted type pressure, archetypes, anti-meta angles, and a Gholdengo lab.

> Note: August 2026 Smogon stats were 404 during the initial research pass, so July 2026 is the latest verified hard usage snapshot for now.

## Commands

```bash
npm run refresh:data
npm run build
npm run serve
```

Then open the URL printed by the server, for example:

```txt
http://localhost:5173
```

You can force a port with `PORT=4173 npm run serve` if your shell supports that syntax.

## Data sources

- Smogon Champions Dex
- Smogon July 2026 `gen9championsvgc2026regmb` usage stats
- Smogon July 2026 `gen9championsvgc2026regmbbo3` usage stats
- Smogon chaos stats summaries

## Current Gholdengo lab focus

Standard moves:

```txt
Make It Rain
Shadow Ball
Nasty Plot
Protect
```

Favorite atypical builds currently tracked:

```txt
Gholdengo @ Spell Tag
Timid Nature
SPs: 28 HP / 11 Def / 12 SpA / 3 SpD / 12 Spe
```

```txt
Gholdengo @ Metal Coat
Timid Nature
SPs: 30 HP / 10 Def / 10 SpA / 4 SpD / 12 Spe
```
