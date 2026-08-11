import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const rawDir = path.join(root, 'data', 'raw');
const outDir = path.join(root, 'docs', 'assets');
await mkdir(outDir, { recursive: true });

const readJson = async name => JSON.parse(await readFile(path.join(rawDir, name), 'utf8'));
const top = (items = [], limit = 8) => items.slice(0, limit).map(item => ({
  name: item.name,
  value: typeof item.value === 'number' ? item.value : item.value?.n ?? item.value,
}));

const index = await readJson('pokemon_champions_index_full.json');
const usageBo3 = await readJson('smogon_usage_july2026_gen9championsvgc2026regmbbo3-1760.json');
const usageBo1 = await readJson('smogon_usage_july2026_gen9championsvgc2026regmb-1760.json');
const chaosBo3 = await readJson('smogon_chaos_summary_july2026_gen9championsvgc2026regmbbo3-1760.json');
const chaosBo1 = await readJson('smogon_chaos_summary_july2026_gen9championsvgc2026regmb-1760.json');
const strategies = await readJson('smogon_strategy_high_priority_full.json');
const teamResearch = await readJson('pokemon_champions_regmb_team_combo_research_2026-08-08.json');

const strategyByName = new Map(strategies.pokemon.map(p => [p.name, p]));
const usageBo3ByName = new Map(usageBo3.rows.map(row => [row.pokemon, row]));
const usageBo1ByName = new Map(usageBo1.rows.map(row => [row.pokemon, row]));

function getStrategySummary(name) {
  const entry = strategyByName.get(name);
  if (!entry) return null;
  const sets = [];
  for (const strategy of entry.strategies || []) {
    for (const moveset of strategy.movesets || []) {
      sets.push({
        format: strategy.format,
        name: moveset.name,
        items: moveset.items || [],
        abilities: moveset.abilities || [],
        natures: moveset.natures || [],
        spreads: moveset.spreads || [],
        moveslots: moveset.moveslots || [],
        notes: moveset.description_plain || strategy.comments_plain || strategy.overview_plain || '',
      });
    }
  }
  return { source: entry.source, sets: sets.slice(0, 5) };
}

function getChaos(name) {
  return chaosBo3.pokemon[name] || chaosBo1.pokemon[name] || null;
}

function spriteSlug(name) {
  return name
    .toLowerCase()
    .replace('-mega-y', '-megay')
    .replace('-mega-x', '-megax')
    .replace('-mega', '-mega')
    .replace('-alola', '-alola')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

function mapPokemon(pokemon) {
  const bo3 = usageBo3ByName.get(pokemon.name);
  const bo1 = usageBo1ByName.get(pokemon.name);
  const chaos = getChaos(pokemon.name);
  return {
    name: pokemon.name,
    slug: pokemon.slug,
    types: pokemon.types || [],
    abilities: pokemon.abilities || [],
    baseStats: {
      hp: pokemon.hp,
      atk: pokemon.atk,
      def: pokemon.def,
      spa: pokemon.spa,
      spd: pokemon.spd,
      spe: pokemon.spe,
    },
    formats: pokemon.formats || [],
    smogonUrl: pokemon.smogon_url,
    spriteUrl: `https://play.pokemonshowdown.com/sprites/gen5/${spriteSlug(pokemon.name)}.png`,
    usage: {
      bo3Rank: bo3?.rank ?? null,
      bo3Percent: bo3?.usage_percent ?? 0,
      bo1Rank: bo1?.rank ?? null,
      bo1Percent: bo1?.usage_percent ?? 0,
    },
    chaos: chaos ? {
      items: top(chaos.items, 8),
      moves: top(chaos.moves, 10),
      spreads: top(chaos.spreads, 8),
      teammates: top(chaos.teammates, 10),
      checks: top(chaos.checks_and_counters, 8),
    } : null,
    strategy: getStrategySummary(pokemon.name),
  };
}

const pokemon = index.pokemon.map(mapPokemon).sort((a, b) => b.usage.bo3Percent - a.usage.bo3Percent);
const topMeta = pokemon.filter(p => p.usage.bo3Percent > 0).slice(0, 50);

const archetypes = [
  {
    name: 'Sun Goodstuff',
    style: 'Aggressive weather offense',
    core: ['Charizard-Mega-Y', 'Garchomp', 'Kingambit', 'Incineroar', 'Whimsicott', 'Floette-Mega'],
    notes: 'Huge BO3 usage overlap. Pressures Gholdengo with Fire/Ground/Dark while using Fairy and speed-control partners Gholdengo can punish if positioned well.',
  },
  {
    name: 'Incineroar + Sinistcha Balance',
    style: 'Bulky pivot / redirection / setup support',
    core: ['Incineroar', 'Sinistcha', 'Sneasler', 'Kingambit', 'Floette-Mega', 'Delphox-Mega'],
    notes: 'The annoying adult table. It wins by forcing awkward turns. Gholdengo likes Good as Gold and Shadow Ball pressure, but must respect Incineroar and Kingambit.',
  },
  {
    name: 'Rain Pressure',
    style: 'Weather offense with bulky special pressure',
    core: ['Pelipper', 'Archaludon', 'Basculegion', 'Swampert-Mega', 'Sinistcha', 'Grimmsnarl'],
    notes: 'Rain softens Fire for Gholdengo but brings Ground/Ghost/Water pressure. Anti-rain prep needs Grass/Electric/Ice answers plus Basculegion respect.',
  },
  {
    name: 'Fast Rock/Fairy Offense',
    style: 'Speed-first pressure',
    core: ['Aerodactyl-Mega', 'Sylveon', 'Garchomp', 'Kingambit', 'Farigiraf', 'Charizard-Mega-Y'],
    notes: 'Metal Coat Gholdengo can punish Fairy/Rock boards, but Rock Slide flinch games are where dignity goes to die.',
  },
  {
    name: 'Sand Gholdengo Pocket',
    style: 'Atypical balance/offense',
    core: ['Gholdengo', 'Tyranitar-Mega', 'Excadrill', 'Sinistcha', 'Incineroar', 'Whimsicott'],
    notes: 'A real usage-correlated shell. Sinistcha helps setup, sand partners pressure Fire/Dark, and Gholdengo punishes Fairy/control pieces.',
  },
];

const gholdengoLab = {
  standardMoves: ['Make It Rain', 'Shadow Ball', 'Nasty Plot', 'Protect'],
  itemRanking: [
    { item: 'Spell Tag', score: 95, plan: 'Atypical Shadow Ball pressure without recoil; best for baiting Make It Rain assumptions.' },
    { item: 'Metal Coat', score: 91, plan: 'More meta-validated BO3 non-recoil item; stronger Make It Rain into Fairy/Rock targets.' },
    { item: 'Life Orb', score: 88, plan: 'Dominant common item and strongest immediate pressure, but recoil exposes the plan.' },
    { item: 'Leftovers', score: 82, plan: 'Bulky setup snowball with Protect; needs support and sacrifices damage.' },
    { item: 'Shuca Berry', score: 78, plan: 'Ground-lure item into Garchomp/Swampert; matchup-dependent but filthy when it works.' },
  ],
  customBuilds: [
    {
      name: 'Spell Tag Shadow Tax',
      item: 'Spell Tag',
      nature: 'Timid',
      sps: '28 HP / 11 Def / 12 SpA / 3 SpD / 12 Spe',
      stats: '190 HP / 126 Def / 165 SpA / 114 SpD / 127 Spe',
      thesis: 'Punishes players anchoring on Life Orb or Make It Rain damage. Shadow Ball becomes the repeatable threat.',
    },
    {
      name: 'Metal Coat Meta Punisher',
      item: 'Metal Coat',
      nature: 'Timid',
      sps: '30 HP / 10 Def / 10 SpA / 4 SpD / 12 Spe',
      stats: '192 HP / 125 Def / 163 SpA / 115 SpD / 127 Spe',
      thesis: 'Leans into common Fairy/Rock targets while dodging Life Orb recoil. Less weird, more stat-backed.',
    },
  ],
};

const typeCounts = {};
for (const mon of topMeta.slice(0, 40)) {
  for (const type of mon.types) typeCounts[type] = (typeCounts[type] || 0) + mon.usage.bo3Percent;
}
const types = Object.entries(typeCounts)
  .map(([type, weightedUsage]) => ({ type, weightedUsage: +weightedUsage.toFixed(2) }))
  .sort((a, b) => b.weightedUsage - a.weightedUsage);

const antiMeta = [
  {
    target: 'Kingambit',
    whyItWins: 'Dark/Steel bulk, priority Sucker Punch, and scary endgame pressure make lazy offense fold.',
    answers: ['Sneasler', 'Mega Staraptor', 'Incineroar', 'Garchomp', 'Kommo-o'],
    plan: 'Do not feed it endgame. Bring Fighting pressure, Intimidate, burns/chip, and avoid obvious Sucker Punch turns with Protect/setup/pivots.',
  },
  {
    target: 'Incineroar',
    whyItWins: 'Fake Out, Intimidate, pivoting, Fire/Dark coverage, and pure emotional terrorism.',
    answers: ['Garchomp', 'Basculegion', 'Mega Swampert', 'Milotic', 'Sneasler'],
    plan: 'Punish switch cycles. Competitive/Defiant-style punishers, strong Water/Ground/Fighting pressure, and Good as Gold pivots all help.',
  },
  {
    target: 'Mega Charizard Y',
    whyItWins: 'Sun-boosted spread Fire damage plus speed-control partners forces ugly Protect turns.',
    answers: ['Garchomp', 'Mega Aerodactyl', 'Tyranitar-Mega', 'Pelipper', 'Blastoise-Mega'],
    plan: 'Change weather, threaten Rock damage, or pressure its speed-control partner. Do not let it freely Heat Wave twice. That is how teams become toast.',
  },
  {
    target: 'Garchomp',
    whyItWins: 'Fast-ish Ground spread pressure, good bulk, and flexible item/spread choices.',
    answers: ['Alolan Ninetales', 'Sinistcha', 'Whimsicott', 'Sylveon', 'Basculegion'],
    plan: 'Use Ice/Fairy pressure, redirection, speed control, and Ground immunities/resists. Shuca/Protect bait lines are legitimate.',
  },
  {
    target: 'Basculegion',
    whyItWins: 'Ghost/Water pressure punishes weakened teams and forces awkward late-game math.',
    answers: ['Kingambit', 'Hydreigon', 'Grimmsnarl', 'Sinistcha', 'Gholdengo'],
    plan: 'Respect its Speed/item variance. Dark pressure, redirection, priority denial, and not donating free KOs are the big lessons.',
  },
];

const gholdengoMatchups = [
  { foe: 'Kingambit', read: 'Bad if you play straight. It threatens Dark priority and resists Make It Rain.', spellTag: 'Shadow Ball chip is okay but not the plan; use Protect/Nasty Plot to punish Sucker Punch reads.', metalCoat: 'Metal Coat does not solve Kingambit. Bring Fighting/Ground partners.' },
  { foe: 'Incineroar', read: 'Annoying because it resists both STABs and threatens Fire/Dark.', spellTag: 'Better for non-dropping chip, but you still need partner pressure.', metalCoat: 'Usually worse here; boosted Make It Rain into resist is still sad confetti.' },
  { foe: 'Garchomp', read: 'Ground pressure is one of the main reasons Gholdengo needs careful positioning.', spellTag: 'Works if your spread lives and you can punish with +2 neutral damage later.', metalCoat: 'Does not fix Ground weakness; pair with redirection, Ice/Fairy pressure, or Shuca tech.' },
  { foe: 'Basculegion', read: 'Speed/item guessing game. Smogon spreads care about Basculegion benchmarks for a reason.', spellTag: 'Best of the two: boosted Shadow Ball directly pressures it.', metalCoat: 'Less direct; relies on Make It Rain neutral pressure and partner support.' },
  { foe: 'Sinistcha', read: 'Gholdengo likes ignoring disruption and threatening Ghost damage.', spellTag: 'Excellent. Repeated Shadow Ball pressure fits the matchup.', metalCoat: 'Fine for spread pressure, but Spell Tag is cleaner into Sinistcha itself.' },
  { foe: 'Charizard-Mega-Y', read: 'Do not be brave into sun Fire damage. Bravery is just misplayed math with a cape.', spellTag: 'Only good if Charizard is controlled/chipped; otherwise preserve Gholdengo.', metalCoat: 'Can punish Fairy partners, not Charizard itself. Bring weather/Rock help.' },
];

gholdengoLab.matchups = gholdengoMatchups;

const teamShells = [
  { style: 'Bulky Balance', mons: ['Incineroar', 'Sinistcha', 'Gholdengo', 'Sneasler', 'Farigiraf', 'Milotic'], notes: 'Pivot, redirection, anti-Intimidate punishment, and two setup/control lanes. Boring? No. Boring wins rent money.' },
  { style: 'Anti-Sun', mons: ['Pelipper', 'Basculegion', 'Garchomp', 'Gholdengo', 'Grimmsnarl', 'Blastoise-Mega'], notes: 'Weather denial plus Water/Rock/Ground pressure into Charizard/Incineroar shells.' },
  { style: 'Anti-Rain', mons: ['Sinistcha', 'Alolan Ninetales', 'Kingambit', 'Gholdengo', 'Whimsicott', 'Hydreigon'], notes: 'Grass/Ice/Dark pressure into Swampert/Basculegion/Archaludon while preserving speed-control options.' },
  { style: 'Gholdengo-Centered', mons: ['Gholdengo', 'Sinistcha', 'Incineroar', 'Sneasler', 'Whimsicott', 'Garchomp'], notes: 'Fake Out/redirection/speed control open Nasty Plot turns; Sneasler/Garchomp handle Dark/Fire problems.' },
  { style: 'Anti-Meta Cheese But Not Stupid', mons: ['Gholdengo', 'Grimmsnarl', 'Milotic', 'Annihilape', 'Alolan Ninetales', 'Mega Staraptor'], notes: 'Screens/Veil, anti-Intimidate, Fighting pressure, and nonstandard damage lines. Spicy, but not clown college.' },
];

const topTeamCombos = teamResearch.labmaus_top20_six_pokemon_combos_by_score_with_observed_win_rate.map(team => ({
  rank: team.rank_by_score,
  pokemon: team.pokemon.map(name => name.trim()),
  score: team.score,
  wins: team.wins,
  losses: team.losses,
  winRatePercent: team.win_rate_percent,
  teamsCount: team.teams_count,
  examples: team.examples || [],
}));

const topTeamCombosByWinRate = [...topTeamCombos]
  .sort((a, b) => b.winRatePercent - a.winRatePercent)
  .slice(0, 10);

const savedTeams = [
  {
    id: 'anti-rain-control',
    name: 'Anti-Rain Control',
    label: 'Gholdengo / Sinistcha anti-rain ladder set',
    thesis: 'Snow + priority denial + Focus Sash Sneasler gives you play into rain, Tailwind, Archaludon, Primarina, and Mega Raichu nonsense.',
    pokemon: ['Gholdengo', 'Sinistcha', 'Ninetales-Alola', 'Sneasler', 'Farigiraf', 'Kingambit'],
    sets: [
      { name: 'Gholdengo', item: 'Spell Tag', ability: 'Good as Gold', nature: 'Timid', sps: '28 HP / 11 Def / 12 SpA / 3 SpD / 12 Spe', moves: ['Make It Rain', 'Shadow Ball', 'Nasty Plot', 'Protect'] },
      { name: 'Sinistcha', item: 'Sitrus Berry', ability: 'Hospitality', nature: 'Bold', sps: '32 HP / 14 Def / 20 SpD', moves: ['Matcha Gotcha', 'Rage Powder', 'Life Dew', 'Protect'] },
      { name: 'Ninetales-Alola', item: 'Light Clay', ability: 'Snow Warning', nature: 'Timid', sps: '4 HP / 32 SpA / 30 Spe', moves: ['Freeze-Dry', 'Blizzard', 'Aurora Veil', 'Protect'] },
      { name: 'Sneasler', item: 'Focus Sash', ability: 'Poison Touch / Unburden', nature: 'Jolly', sps: '2 HP / 32 Atk / 32 Spe', moves: ['Close Combat', 'Dire Claw', 'Fake Out / Protect', 'Protect / Coaching'] },
      { name: 'Farigiraf', item: 'Mental Herb', ability: 'Armor Tail', nature: 'Bold', sps: '30 HP / 24 Def / 12 SpD', moves: ['Trick Room', 'Psychic', 'Helping Hand', 'Protect'] },
      { name: 'Kingambit', item: 'Black Glasses', ability: 'Defiant', nature: 'Adamant', sps: '32 HP / 32 Atk / 2 SpD', moves: ['Kowtow Cleave', 'Sucker Punch', 'Iron Head', 'Protect'] },
    ],
    defaultPlans: [
      { into: 'Rain / Archaludon / Primarina', bring: ['Farigiraf', 'Sinistcha', 'Ninetales-Alola', 'Sneasler'], lead: ['Farigiraf', 'Sinistcha'], note: 'Trick Room punishes Tailwind/rain speed. Ninetales threatens Water/Ground/Dragon boards with Freeze-Dry/Blizzard.' },
      { into: 'Charizard + Garchomp Tailwind', bring: ['Sneasler', 'Farigiraf', 'Ninetales-Alola', 'Kingambit'], lead: ['Sneasler', 'Farigiraf'], note: 'Fake Out or pressure the speed-control slot, then Trick Room. Kingambit handles Ghost/Psychic endgames.' },
      { into: 'Passive status/control', bring: ['Gholdengo', 'Sinistcha', 'Farigiraf', 'Kingambit'], lead: ['Gholdengo', 'Sinistcha'], note: 'Good as Gold + Rage Powder/Life Dew creates Nasty Plot chances.' },
    ],
  },
  {
    id: 'sand-balance-master-prep',
    name: 'Sand Balance Master Prep',
    label: 'LabMaus #1 score shell: Gholdengo / Sinistcha / Tyranitar / Milotic / Staraptor / Excadrill',
    thesis: 'Multiple modes: Tyranitar + Excadrill speed, Milotic + Staraptor anti-Intimidate tempo, and Gholdengo + Sinistcha setup.',
    pokemon: ['Gholdengo', 'Milotic', 'Staraptor-Mega', 'Excadrill', 'Sinistcha', 'Tyranitar-Mega'],
    sets: [
      { name: 'Gholdengo', item: 'Spell Tag', ability: 'Good as Gold', nature: 'Timid', sps: '28 HP / 11 Def / 12 SpA / 3 SpD / 12 Spe', moves: ['Make It Rain', 'Shadow Ball', 'Nasty Plot', 'Protect'] },
      { name: 'Milotic', item: 'Leftovers', ability: 'Competitive', nature: 'Calm', sps: '20 HP / 20 Def / 4 SpA / 8 SpD / 14 Spe', moves: ['Scald', 'Icy Wind', 'Ice Beam', 'Protect'] },
      { name: 'Staraptor-Mega', item: 'Staraptite', ability: 'Intimidate', nature: 'Jolly', sps: '17 HP / 17 Atk / 32 Spe', moves: ['Close Combat', 'Brave Bird', 'Tailwind', 'Protect'] },
      { name: 'Excadrill', item: 'Focus Sash', ability: 'Sand Rush', nature: 'Adamant', sps: '2 HP / 32 Atk / 32 Spe', moves: ['High Horsepower', 'Iron Head', 'Rock Slide', 'Protect'] },
      { name: 'Sinistcha', item: 'Sitrus Berry', ability: 'Hospitality', nature: 'Bold', sps: '32 HP / 14 Def / 20 SpD', moves: ['Matcha Gotcha', 'Rage Powder', 'Life Dew', 'Protect'] },
      { name: 'Tyranitar-Mega', item: 'Tyranitarite', ability: 'Sand Stream', nature: 'Adamant', sps: '32 HP / 13 Atk / 4 Def / 17 Spe', moves: ['Rock Slide', 'Knock Off', 'Low Kick', 'Protect'] },
    ],
    defaultPlans: [
      { into: 'Unknown offense / weather', bring: ['Tyranitar-Mega', 'Excadrill', 'Staraptor-Mega', 'Milotic'], lead: ['Tyranitar-Mega', 'Excadrill'], note: 'Sand Rush reverses speed. Milotic/Staraptor stabilize if the sand mirror or Garchomp appears.' },
      { into: 'Incineroar balance', bring: ['Milotic', 'Staraptor-Mega', 'Gholdengo', 'Sinistcha'], lead: ['Milotic', 'Staraptor-Mega'], note: 'Competitive punishes Intimidate; Staraptor supplies Tailwind and Fighting/Flying pressure.' },
      { into: 'Passive screens/control', bring: ['Gholdengo', 'Sinistcha', 'Tyranitar-Mega', 'Excadrill'], lead: ['Gholdengo', 'Sinistcha'], note: 'Set up with Nasty Plot behind Rage Powder/Life Dew, then use sand as the closer.' },
    ],
  },
];

const matchupRules = [
  { tag: 'Rain / Water speed', triggers: ['Pelipper', 'Basculegion', 'Archaludon', 'Primarina', 'Swampert-Mega', 'Mega Swampert'], advice: 'Prioritize weather denial, Trick Room/Icy Wind, and do not let rain stay up for free.' },
  { tag: 'Sun / Charizard', triggers: ['Charizard-Mega-Y', 'Charizard', 'Venusaur', 'Torkoal'], advice: 'Reset weather with Tyranitar/Ninetales, pressure Charizard with Rock Slide, and respect boosted Fire spread damage.' },
  { tag: 'Ground pressure', triggers: ['Garchomp', 'Excadrill', 'Swampert-Mega', 'Landorus-Therian'], advice: 'Avoid lazy Gholdengo positioning. Use Ninetales, Milotic, Sinistcha, Protect, and redirection/Speed control.' },
  { tag: 'Dark / Ghost pressure', triggers: ['Kingambit', 'Gengar-Mega', 'Gengar', 'Zoroark-Hisui', 'Basculegion', 'Tyranitar-Mega'], advice: 'Bring Kingambit/Fighting pressure; do not rely on Sucker Punch while opposing Farigiraf is active.' },
  { tag: 'Tailwind speed control', triggers: ['Whimsicott', 'Talonflame', 'Staraptor-Mega', 'Staraptor'], advice: 'Lead Fake Out/Trick Room or sand speed; if they Tailwind, make it a liability.' },
  { tag: 'Intimidate / pivot balance', triggers: ['Incineroar', 'Staraptor-Mega', 'Staraptor', 'Arcanine-Hisui'], advice: 'Milotic becomes premium. Punish Intimidate cycles and avoid over-clicking physical damage into bad boards.' },
];

const ladderNotes = [
  { title: 'Common bad assumption: Gholdengo is always Life Orb', note: 'Use non-recoil items and bulk shifts to make their damage math wrong. People anchor hard on first-order calcs.' },
  { title: 'Overused lead: Incineroar + obvious sweeper', note: 'Expect Fake Out or pivot. Protecting the obvious target is often correct, but punishing the partner can be better.' },
  { title: 'Panic button: Sucker Punch', note: 'Kingambit players click it when scared. Nasty Plot, Protect, switch, or double the partner if the board supports it.' },
  { title: 'Panic button: spread move spam', note: 'Heat Wave, Earthquake, Rock Slide, Make It Rain. Wide positioning and Protect sequencing wins games versus autopilot spread damage.' },
  { title: 'Not everyone is rational', note: 'Ladder opponents often choose comfort lines, not optimal lines. Build teams that punish common habits, not just perfect play.' },
];

const siteData = {
  generatedAt: new Date().toISOString(),
  sources: {
    smogonDex: index.source,
    bo3Usage: usageBo3.source,
    bo1Usage: usageBo1.source,
    note: 'August 2026 Smogon usage directory returned 404 during research; July 2026 is latest verified hard usage snapshot.',
  },
  pokemon,
  topMeta,
  types,
  archetypes,
  antiMeta,
  topTeamCombos,
  topTeamCombosByWinRate,
  savedTeams,
  matchupRules,
  teamShells,
  ladderNotes,
  gholdengoLab,
};

await writeFile(path.join(outDir, 'site-data.js'), `window.POKE_CHAM_DATA = ${JSON.stringify(siteData)};\n`);
await writeFile(path.join(outDir, 'site-data.json'), JSON.stringify(siteData, null, 2));
console.log(`Built docs/assets/site-data.js with ${pokemon.length} Pokemon.`);
