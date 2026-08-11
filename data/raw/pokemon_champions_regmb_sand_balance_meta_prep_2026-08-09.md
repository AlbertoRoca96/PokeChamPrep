# Pokemon Champions VGC 2026 Regulation M-B meta prep — sand balance

**As of:** 2026-08-09  
**Focus team:** Gholdengo / Milotic / Mega Staraptor / Excadrill / Sinistcha / Mega Tyranitar

## Files

- Structured JSON: `C:\Users\alroc\PokeChamPrep\data\raw\pokemon_champions_regmb_sand_balance_meta_prep_2026-08-09.json`
- This summary: `C:\Users\alroc\PokeChamPrep\data\raw\pokemon_champions_regmb_sand_balance_meta_prep_2026-08-09.md`

## Source status

- **Serebii Regulation M-B:** Regulation M-B runs **June 17 2026 - September 9 2026**. Doubles uses 4-6 Pokemon, Level 50, 7 minute player timer, 90 second preview, 45 second turns. Season M-5 began Aug 5 and continues to Sept 9.
- **Smogon stats:** August 2026 stats were not available during this run (`/stats/2026-08/` returned 404). I used **July 2026 `gen9championsvgc2026regmbbo3-1760`** as the high-rank/ranked-ladder proxy.
- **LabMaus:** `/api/top_teams?language=en` was available. It is tournament/open-team-sheet aggregation by LabMaus score, not pure ladder, but it is the strongest public source for top performing six-Pokemon compositions.
- **Limitless:** completed tournament listing for Aug 8-10 showed many Champions / Reg M-B events, confirming active tournament context around the target date.

## Big headline

The focus team is not fringe. On LabMaus top six-Pokemon compositions, the exact six:

```txt
Gholdengo / Sinistcha / Tyranitar / Milotic / Staraptor / Excadrill
```

was **#1 by LabMaus score** at retrieval:

```txt
Score: 1303
Wins/losses: 961-478
Observed win rate: 66.8%
Sample top finishes:
- Daredevilzz26, 1st, 11-1, Sitrus-Series Champions-MB #67, https://pokepast.es/9cd069ccd073816a
- Philip9804, 1st, 11-1, Regulation M-B: Open League #3, https://pokepast.es/a5c1698cfde19916
- spaddy02, 5th, 11-1, Free entry! $250 Global VGC Welcome Tour!, https://pokepast.es/f16ee90708a6ec41
```

## Smogon July 2026 BO3 1760 usage anchors

Top usage threats and relevant team members:

| Rank | Pokemon | Usage % |
|---:|---|---:|
| 1 | Kingambit | 49.24 |
| 2 | Incineroar | 45.46 |
| 3 | Charizard-Mega-Y | 40.58 |
| 4 | Garchomp | 37.01 |
| 5 | Basculegion | 31.87 |
| 6 | Sinistcha | 29.04 |
| 7 | Sneasler | 28.11 |
| 8 | Floette-Mega | 23.91 |
| 9 | Whimsicott | 22.16 |
| 12 | Venusaur | 14.15 |
| 14 | Archaludon | 13.13 |
| 15 | Grimmsnarl | 11.55 |
| 16 | Pelipper | 11.27 |
| 18 | Staraptor-Mega | 11.18 |
| 19 | Gholdengo | 10.90 |
| 26 | Tyranitar-Mega | 5.62 |
| 29 | Milotic | 5.38 |
| 30 | Excadrill | 5.04 |

## Common focus-team sets from public pastes

```txt
Tyranitar @ Tyranitarite
Ability: Sand Stream
- Rock Slide
- Knock Off
- Low Kick / High Horsepower
- Protect

Excadrill @ Focus Sash
Ability: Sand Rush
- Iron Head
- Rock Slide
- High Horsepower / Earthquake
- Protect

Milotic @ Sitrus Berry
Ability: Competitive
- Scald
- Icy Wind
- Ice Beam / Haze
- Protect

Sinistcha @ Colbur Berry
Ability: Hospitality
- Matcha Gotcha
- Rage Powder
- Protect
- Shadow Ball / Strength Sap

Staraptor @ Staraptite
Ability: Intimidate pre-Mega -> Contrary after Mega
- Brave Bird
- Close Combat
- Tailwind
- Protect

Gholdengo @ Life Orb
Ability: Good as Gold
- Make It Rain
- Shadow Ball
- Nasty Plot
- Protect
```

## Top public archetypes

1. **Sand balance mirror / exact focus team** — Gholdengo, Sinistcha, Tyranitar, Milotic, Staraptor, Excadrill.
2. **Rain-sun weather balance** — Venusaur, Charizard, Archaludon, Pelipper, Grimmsnarl, Basculegion.
3. **Tailwind Charizard/Garchomp/Floette offense** — Charizard, Garchomp, Whimsicott, Floette, Basculegion, Kingambit.
4. **Mega Aerodactyl + Charizard/Garchomp balance** — Charizard, Aerodactyl, Garchomp, Sylveon, Farigiraf, Kingambit.
5. **Fast physical hyper offense** — Froslass, Lycanroc-Dusk, Basculegion, Sneasler, Scovillain, Kingambit.
6. **Bulky setup/redirection balance** — Blastoise, Sinistcha, Delphox, Incineroar, Sneasler, Kingambit.

## Matchup plans for the sand-balance team

### 1. Mirror / sand balance

Likely opposing leads:

```txt
Staraptor + Tyranitar
Tyranitar + Excadrill
Sinistcha + Gholdengo
```

Recommended bring:

```txt
Lead: Milotic + Staraptor-Mega
Back: Tyranitar-Mega + Excadrill
```

Plan:
- Milotic discourages pre-Mega Staraptor/Intimidate and can control speed with Icy Wind.
- Staraptor gives Tailwind and immediate Close Combat / Brave Bird pressure.
- Preserve Tyranitar until Excadrill can actually exploit sand; avoid pure Excadrill speed-tie endgames if you can use Icy Wind/Tailwind first.
- If they show Gholdengo + Sinistcha as their likely mode, consider Gholdengo over Milotic to avoid being too passive.

### 2. Charizard-Mega-Y + Garchomp + Whimsicott/Floette/Kingambit

Likely leads:

```txt
Whimsicott + Charizard
Whimsicott + Garchomp
Floette + Garchomp
```

Recommended bring:

```txt
Lead: Tyranitar-Mega + Excadrill
Back: Milotic + Staraptor-Mega
```

Plan:
- Mega Tyranitar flips sun to sand and enables Sand Rush immediately.
- Rock Slide pressure threatens Charizard and Whimsicott. Excadrill also pressures Floette/Kingambit with Iron Head / Ground coverage.
- Milotic is your Garchomp stabilizer through Icy Wind / Ice Beam.
- Staraptor is late Tailwind plus Close Combat into Kingambit.
- Usually bench Gholdengo if they have Garchomp + Kingambit unless you see a safer Nasty Plot route.

### 3. Rain: Pelipper + Archaludon + Basculegion + Venusaur/Grimmsnarl

Likely leads:

```txt
Pelipper + Archaludon
Grimmsnarl + Archaludon
Pelipper + Basculegion
```

Recommended bring:

```txt
Lead: Tyranitar-Mega + Excadrill
Back: Sinistcha + Gholdengo
```

Plan:
- Weather control is mandatory: keep Tyranitar healthy enough to reset sand after Pelipper.
- Excadrill pressures Archaludon, Grimmsnarl, and chip lines with Rock Slide.
- Sinistcha redirects key single-target pressure and heals with Hospitality; Matcha Gotcha is also useful into physical attackers.
- Gholdengo can Nasty Plot on passive screens/control turns and blocks many status/control lines.
- Be careful not to let Basculegion attack in rain freely; sand denial is often more important than immediate KO attempts.

### 4. Incineroar + Sneasler + Sinistcha + Kingambit/Delphox/Blastoise balance

Likely leads:

```txt
Incineroar + Sneasler
Sinistcha + Delphox
Sinistcha + Kingambit
```

Recommended bring:

```txt
Lead: Milotic + Staraptor-Mega
Back: Gholdengo + Sinistcha
```

Plan:
- Milotic punishes Incineroar cycling with Competitive and provides Icy Wind speed control.
- Staraptor threatens Sneasler and Kingambit; Tailwind can force their defensive Protects.
- Gholdengo is good into Sinistcha/control boards and can snowball with Nasty Plot.
- Sinistcha protects Gholdengo from single-target attacks and extends the game with Hospitality.

### 5. Mega Aerodactyl / fast physical balance

Likely leads:

```txt
Aerodactyl + Charizard
Aerodactyl + Garchomp
Farigiraf + Sylveon
```

Recommended bring:

```txt
Lead: Tyranitar-Mega + Excadrill
Back: Milotic + Gholdengo
```

Plan:
- Sand Rush reverses their speed advantage.
- Rock Slide / Iron Head pressures Aerodactyl, Charizard, and Sylveon.
- Milotic covers Garchomp and prevents the physical plan from being too vulnerable to Intimidate.
- Gholdengo gives you a special endgame if physical trades become unfavorable.

### 6. Froslass / Lycanroc / Sneasler hyper offense

Likely leads:

```txt
Froslass + Sneasler
Lycanroc + Basculegion
Sneasler + Kingambit
```

Recommended bring:

```txt
Lead: Tyranitar-Mega + Excadrill
Back: Staraptor-Mega + Milotic
```

Plan:
- Use Rock Slide / Iron Head pressure to break sashes and force Protects.
- Sand chip matters a lot into Focus Sash-style offense.
- Staraptor handles Sneasler and Kingambit if positioned safely.
- Milotic stabilizes with Icy Wind/Scald and is your best water/Garchomp answer.

## General decision rules

- Default into unknown fast/offensive teams: **Tyranitar + Excadrill lead, Staraptor + Milotic back**.
- Default into Incineroar/control: **Milotic + Staraptor lead**.
- Default into passive screens/redirection/status: **Gholdengo + Sinistcha mode** becomes more attractive.
- Preserve Tyranitar in weather wars; sand re-entry is often your win condition.
- Do not reduce the team to only sand. Staraptor Tailwind + Milotic Icy Wind are how you avoid losing to speed ties and weather denial.
- Gholdengo is best when it gets one protected Nasty Plot turn behind Sinistcha or into passive control; it is worse when the opponent can immediately combine Ground + Dark pressure.
