# Pokemon Champions / VGC 2026 Regulation M-B team-combo research

Generated: 2026-08-08

## Bottom line

I did **not** find a clean public source that publishes the exact **top 20 six-Pokemon team combinations sorted by win rate** for Pokemon Champions / VGC 2026 Regulation M-B.

The best public alternative found is **LabMaus**. Its `top_teams` API exposes six-Pokemon compositions with aggregate `wins`, `losses`, `score`, team count, and example tournament finishes/pastes. However, the endpoint appears sorted by **score**, not by pure win rate, so it is not a definitive global top-20-by-win-rate table.

Smogon / Pokemon Showdown public stats are excellent for ladder usage and teammate correlation, but I found no public full-team six-mon win-rate table in the monthly stats. July 2026 is the latest Smogon stats month found; `https://www.smogon.com/stats/2026-08/` returned 404 during collection.

Structured JSON saved next to this file:

`C:\Users\alroc\PokeChamPrep\data\raw\pokemon_champions_regmb_team_combo_research_2026-08-08.json`

## Best available six-Pokemon combo table: LabMaus score top 20

Source: `https://labmaus.net/api/top_teams?language=en`

Caveat: observed win rate is calculated as `wins / (wins + losses)` from LabMaus aggregate fields. This is not guaranteed to be the globally highest win-rate ranking because the source order is score-based and lower-sample high-win-rate teams may be omitted or appear lower.

| Score rank | Team | Score | W-L | Win % | Team count |
|---:|---|---:|---:|---:|---:|
| 1 | Gholdengo / Sinistcha / Tyranitar / Milotic / Staraptor / Excadrill | 1227 | 891-433 | 67.30 | 178 |
| 2 | Venusaur / Charizard / Archaludon / Pelipper / Grimmsnarl / Basculegion | 1162 | 785-381 | 67.32 | 164 |
| 3 | Charizard / Aerodactyl / Garchomp / Sylveon / Farigiraf / Kingambit | 904 | 662-316 | 67.69 | 138 |
| 4 | Charizard / Garchomp / Whimsicott / Floette / Basculegion / Kingambit | 869 | 595-269 | 68.87 | 120 |
| 5 | Froslass / Lycanroc-Dusk / Basculegion / Sneasler / Scovillain / Kingambit | 646 | 337-133 | 71.70 | 61 |
| 6 | Blastoise / Sinistcha / Delphox / Incineroar / Sneasler / Kingambit | 529 | 422-207 | 67.09 | 88 |
| 7 | Arcanine-Hisui / Dragonite / Whimsicott / Floette / Basculegion / Kingambit | 494 | 276-89 | 75.62 | 45 |
| 8 | Staraptor / Garchomp / Whimsicott / Delphox / Glimmora / Kingambit | 457 | 364-191 | 65.59 | 79 |
| 9 | Venusaur / Charizard / Garchomp / Incineroar / Toxapex / Annihilape | 379 | 308-166 | 64.98 | 68 |
| 10 | Venusaur / Charizard / Archaludon / Swampert / Pelipper / Grimmsnarl | 370 | 171-77 | 68.95 | 30 |
| 11 | Gengar / Archaludon / Politoed / Swampert / Vivillon / Incineroar | 360 | 241-112 | 68.27 | 47 |
| 12 | Raichu / Arcanine-Hisui / Staraptor / Sylveon / Farigiraf / Kingambit | 295 | 223-106 | 67.78 | 46 |
| 13 | Charizard / Aerodactyl / Garchomp / Sylveon / Incineroar / Kingambit | 273 | 213-117 | 64.55 | 46 |
| 14 | Charizard / Ninetales-Alola / Whimsicott / Kommo-o / Glimmora / Kingambit | 259 | 155-61 | 71.76 | 27 |
| 15 | Charizard / Garchomp / Whimsicott / Floette / Incineroar / Basculegion | 194 | 75-27 | 73.53 | 12 |
| 16 | Dragonite / Blaziken / Froslass / Toxapex / Sneasler / Kingambit | 189 | 160-86 | 65.04 | 34 |
| 17 | Sinistcha / Delphox / Floette / Incineroar / Sneasler / Kingambit | 166 | 128-52 | 71.11 | 23 |
| 18 | Venusaur / Charizard / Sinistcha / Garchomp / Floette / Incineroar | 162 | 49-11 | 81.67 | 7 |
| 19 | Raichu / Sinistcha / Milotic / Floette / Incineroar / Ceruledge | 154 | 77-30 | 71.96 | 14 |
| 20 | Ninetales-Alola / Metagross / Hydreigon / Talonflame / Floette / Ceruledge | 148 | 101-45 | 69.18 | 18 |

## High-confidence alternatives / shells

1. **Sand balance**: Gholdengo / Sinistcha / Tyranitar / Milotic / Staraptor / Excadrill
   - LabMaus score rank 1, 178 teams, 891-433 aggregate.
   - Multiple first-place 11-1 examples.

2. **Sun/rain hybrid offense**: Venusaur / Charizard / Archaludon / Pelipper / Grimmsnarl / Basculegion
   - LabMaus score rank 2, 164 teams, 785-381 aggregate.
   - Matches Smogon usage presence: Charizard-Mega-Y, Basculegion, Archaludon, Pelipper, Grimmsnarl are all prominent.

3. **Charizard/Garchomp/Kingambit goodstuffs**
   - Variants include Whimsicott/Floette/Basculegion and Aerodactyl/Sylveon/Farigiraf.
   - Smogon July BO3 usage has Kingambit #1, Charizard-Mega-Y #3, Garchomp #4, Basculegion #5, Whimsicott #9.

4. **Mega Froslass hyper offense**: Froslass / Lycanroc-Dusk / Basculegion / Sneasler / Scovillain / Kingambit
   - LabMaus score rank 5; 71.70% aggregate win rate over 470 recorded games.
   - Examples include 12-0 and 12-1 event wins.

5. **Floette/Incineroar/Sinistcha balance**
   - Floette, Incineroar, and Sinistcha appear repeatedly in high-performing LabMaus compositions.
   - Smogon July BO3 usage also supports Incineroar #2, Sinistcha #6, Floette-Mega #8.

## Smogon / Pokemon Showdown July 2026 BO3 1760 usage anchors

Source: `https://www.smogon.com/stats/2026-07/gen9championsvgc2026regmbbo3-1760.txt`

Number of BO3 battles in chaos JSON: 200,850.

Top usage: Kingambit 49.24%, Incineroar 45.46%, Charizard-Mega-Y 40.58%, Garchomp 37.01%, Basculegion 31.87%, Sinistcha 29.04%, Sneasler 28.11%, Floette-Mega 23.91%, Whimsicott 22.16%, Sylveon 16.08%, Farigiraf 14.77%, Venusaur 14.15%, Delphox-Mega 13.35%, Archaludon 13.13%, Grimmsnarl 11.55%, Pelipper 11.27%, Blastoise-Mega 11.20%, Staraptor-Mega 11.18%, Gholdengo 10.90%, Toxapex 9.95%.

## Other public sources checked

- **Limitless** (`https://play.limitlesstcg.com/tournaments/completed?game=VGC`): useful for event-level standings, records, and public teamlists. It confirms many Champions / Reg M-B events but is not an aggregate team-combo win-rate database by itself.
- **LabMaus tournament pages/API**: strongest source for aggregate tournament team composition performance and team paste examples.
- **Smogon stats / chaos JSON**: strongest source for Pokemon Showdown ladder usage and pairwise teammate data; no full six-team win-rate stats found.
- **Victory Road / Pikalytics-like sources**: not found to have an exact public Champions Regulation M-B six-combo win-rate table during this pass.
