// Reproducible collector for Pokemon Champions prep data.
// Run from repo root with: node data/raw/collect_pokemon_champions_smogon_data.mjs
// Writes full Smogon Champions index, July 2026 usage/chaos summaries, and high-priority strategy dumps to data/raw.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('data/raw');
await mkdir(outDir, { recursive: true });
const generatedAt = new Date().toISOString();

function slug(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function topObj(obj, n = 10) {
  if (!obj) return [];
  return Object.entries(obj).sort((a, b) => {
    const av = typeof a[1] === 'number' ? a[1] : (a[1]?.n ?? 0);
    const bv = typeof b[1] === 'number' ? b[1] : (b[1]?.n ?? 0);
    return bv - av;
  }).slice(0, n).map(([name, value]) => ({ name, value }));
}
function stripHtml(html) { return String(html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim(); }
function parseUsage(txt) {
  const rows = [];
  for (const line of txt.split('\n')) {
    if (!line.startsWith('|')) continue;
    const parts = line.split('|').map(s => s.trim());
    if (!/^\d+$/.test(parts[1] || '')) continue;
    rows.push({ rank: +parts[1], pokemon: parts[2], usage_percent: parseFloat((parts[3] || '').replace('%', '')), raw: +(parts[4] || '0'), raw_percent: parseFloat((parts[5] || '').replace('%', '')), real: +(parts[6] || '0'), real_percent: parseFloat((parts[7] || '').replace('%', '')) });
  }
  return rows;
}
function csv(rows) { const cols = Object.keys(rows[0] || {}); return [cols.join(','), ...rows.map(r => cols.map(c => JSON.stringify(r[c] ?? '')).join(','))].join('\n'); }
async function fetchText(url) { const r = await fetch(url); if (!r.ok) return { ok: false, status: r.status, text: '' }; return { ok: true, status: r.status, text: await r.text() }; }
async function save(name, value) { await writeFile(path.join(outDir, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2)); }

// Pull dex settings from initial HTML; this script uses a regex fallback because Smogon embeds initial RPC data in page scripts.
const dexHtml = await (await fetch('https://www.smogon.com/dex/champions/pokemon/')).text();
const dsMatch = dexHtml.match(/(?:window\.)?dexSettings\s*=\s*(\{[\s\S]*?\})\s*<\/script>/);
if (!dsMatch) {
  throw new Error('Could not locate dexSettings in Champions dex HTML; use browser workflow if Smogon changes hydration format.');
}
const dexSettings = JSON.parse(dsMatch[1]);
const dumpBasics = dexSettings.injectRpcs.find(([rpc]) => JSON.parse(rpc)[0] === 'dump-basics')[1];
const pokemonIndex = dumpBasics.pokemon.map(p => ({ ...p, slug: slug(p.name), smogon_url: `https://www.smogon.com/dex/champions/pokemon/${slug(p.name)}/` }));
await save('pokemon_champions_index_full.json', { source: 'https://www.smogon.com/dex/champions/pokemon/', generated_at: generatedAt, count: pokemonIndex.length, pokemon: pokemonIndex });

const availability = {};
for (const month of ['2026-08', '2026-07']) {
  const base = `https://www.smogon.com/stats/${month}/`;
  const idx = await fetchText(base);
  availability[month] = { index: { ok: idx.ok, status: idx.status }, available_files: idx.ok ? [...idx.text.matchAll(/href="([^"]*gen9championsvgc2026regmb[^"]*)"/g)].map(x => x[1]) : [] };
}
await save('smogon_usage_availability_latest.json', availability);

const base = 'https://www.smogon.com/stats/2026-07/';
const formats = { regmb: 'gen9championsvgc2026regmb-1760', regmb_bo3: 'gen9championsvgc2026regmbbo3-1760' };
const usage = {}, chaosSummary = {};
for (const [key, file] of Object.entries(formats)) {
  const txt = await fetchText(base + file + '.txt');
  usage[key] = { source: base + file + '.txt', ok: txt.ok, status: txt.status, rows: txt.ok ? parseUsage(txt.text) : [] };
  await save(`smogon_usage_july2026_${file}.json`, usage[key]);
  await save(`smogon_usage_july2026_${file}.csv`, csv(usage[key].rows));
  const chaos = await (await fetch(base + 'chaos/' + file + '.json')).json();
  chaosSummary[key] = { source: base + 'chaos/' + file + '.json', info: chaos.info, pokemon: Object.fromEntries(Object.entries(chaos.data).map(([name, d]) => [name, { raw_count: d['Raw count'], usage: d.usage, viability_ceiling: d['Viability Ceiling'], abilities: topObj(d.Abilities, 8), items: topObj(d.Items, 12), spreads: topObj(d.Spreads, 12), moves: topObj(d.Moves, 16), tera_types: topObj(d['Tera Types'], 8), teammates: topObj(d.Teammates, 20), checks_and_counters: topObj(d['Checks and Counters'], 16) }])) };
  await save(`smogon_chaos_summary_july2026_${file}.json`, chaosSummary[key]);
}

async function rpcPokemon(name) {
  const r = await fetch('https://www.smogon.com/dex/_rpc/dump-pokemon', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ alias: slug(name), gen: 'champions', language: 'en' }) });
  if (!r.ok) throw new Error(`${name}: HTTP ${r.status}`);
  return r.json();
}
const bo3Rows = usage.regmb_bo3.rows;
const singleRows = usage.regmb.rows;
const topNames = [...new Set([...bo3Rows.slice(0, 80).map(r => r.pokemon), ...singleRows.slice(0, 50).map(r => r.pokemon), 'Gholdengo'])];
const strategies = [], errors = [];
for (const name of topNames) {
  try {
    const data = await rpcPokemon(name);
    strategies.push({ name, slug: slug(name), source: `https://www.smogon.com/dex/champions/pokemon/${slug(name)}/`, learnset_count: data.learnset?.length || 0, strategies: (data.strategies || []).map(st => ({ format: st.format, outdated: st.outdated, overview_plain: stripHtml(st.overview), comments_plain: stripHtml(st.comments), movesets: (st.movesets || []).map(ms => ({ name: ms.name, pokemon: ms.pokemon, description_plain: stripHtml(ms.description), description_html: ms.description, abilities: ms.abilities, items: ms.items, tera_types: ms.teratypes, moveslots: ms.moveslots, spreads: ms.evconfigs, natures: ms.natures, levels: ms.levels })) })) });
  } catch (e) { errors.push({ name, error: String(e) }); }
  await new Promise(r => setTimeout(r, 75));
}
await save('smogon_strategy_high_priority_full.json', { generated_at: generatedAt, attempted: topNames.length, analyzed_count: strategies.filter(p => p.strategies.some(s => s.movesets.length)).length, errors, pokemon: strategies });
const merged = topNames.map(name => ({ name, basics: pokemonIndex.find(p => p.name === name) || null, usage_rank_bo3: bo3Rows.find(r => r.pokemon === name) || null, usage_rank_regmb: singleRows.find(r => r.pokemon === name) || null, chaos_summary: chaosSummary.regmb_bo3.pokemon[name] || chaosSummary.regmb.pokemon[name] || null, smogon_strategy: strategies.find(p => p.name === name) || null }));
await save('pokemon_champions_prep_merged_high_priority_full.json', { generated_at: generatedAt, sources: ['Smogon Champions dex', 'Smogon July 2026 usage/chaos 1760'], notes: ['August 2026 Smogon stats directory returned 404 during initial research.', 'Chaos top lists truncated in summary output.'], pokemon: merged });
console.log(`Done. Index=${pokemonIndex.length}, high-priority=${topNames.length}, strategy dumps=${strategies.length}`);
