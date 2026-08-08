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
  gholdengoLab,
};

await writeFile(path.join(outDir, 'site-data.js'), `window.POKE_CHAM_DATA = ${JSON.stringify(siteData)};\n`);
await writeFile(path.join(outDir, 'site-data.json'), JSON.stringify(siteData, null, 2));
console.log(`Built docs/assets/site-data.js with ${pokemon.length} Pokemon.`);
