const data = window.POKE_CHAM_DATA;
const $ = selector => document.querySelector(selector);
const el = (tag, className, html = '') => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.innerHTML = html;
  return node;
};

const pct = value => `${Number(value || 0).toFixed(2)}%`;
const chips = values => `<div class="chips">${(values || []).map(v => `<span class="badge type">${v}</span>`).join('')}</div>`;
const byName = new Map(data.pokemon.map(mon => [mon.name, mon]));
const aliases = new Map([
  ['Charizard', 'Charizard-Mega-Y'],
  ['Floette', 'Floette-Mega'],
  ['Staraptor', 'Staraptor-Mega'],
  ['Tyranitar', 'Tyranitar-Mega'],
  ['Swampert', 'Swampert-Mega'],
  ['Gengar', 'Gengar-Mega'],
  ['Blastoise', 'Blastoise-Mega'],
  ['Delphox', 'Delphox-Mega'],
  ['Froslass', 'Froslass-Mega'],
  ['Aerodactyl', 'Aerodactyl-Mega'],
  ['Raichu', 'Raichu-Mega-Y'],
  ['Metagross', 'Metagross-Mega'],
  ['Blaziken', 'Blaziken-Mega'],
]);
const findMon = name => byName.get(name) || byName.get(aliases.get(name));
const sprite = name => {
  const mon = findMon(name);
  if (!mon?.spriteUrl) return '';
  return `<img class="sprite" src="${mon.spriteUrl}" alt="${name}" loading="lazy" onerror="this.remove()" />`;
};
let selectedTeam = [];

const typeChart = {
  Normal: { weak: ['Fighting'], resist: [], immune: ['Ghost'] },
  Fire: { weak: ['Water', 'Ground', 'Rock'], resist: ['Fire', 'Grass', 'Ice', 'Bug', 'Steel', 'Fairy'] },
  Water: { weak: ['Electric', 'Grass'], resist: ['Fire', 'Water', 'Ice', 'Steel'] },
  Electric: { weak: ['Ground'], resist: ['Electric', 'Flying', 'Steel'] },
  Grass: { weak: ['Fire', 'Ice', 'Poison', 'Flying', 'Bug'], resist: ['Water', 'Electric', 'Grass', 'Ground'] },
  Ice: { weak: ['Fire', 'Fighting', 'Rock', 'Steel'], resist: ['Ice'] },
  Fighting: { weak: ['Flying', 'Psychic', 'Fairy'], resist: ['Bug', 'Rock', 'Dark'] },
  Poison: { weak: ['Ground', 'Psychic'], resist: ['Grass', 'Fighting', 'Poison', 'Bug', 'Fairy'] },
  Ground: { weak: ['Water', 'Grass', 'Ice'], resist: ['Poison', 'Rock'], immune: ['Electric'] },
  Flying: { weak: ['Electric', 'Ice', 'Rock'], resist: ['Grass', 'Fighting', 'Bug'], immune: ['Ground'] },
  Psychic: { weak: ['Bug', 'Ghost', 'Dark'], resist: ['Fighting', 'Psychic'] },
  Bug: { weak: ['Fire', 'Flying', 'Rock'], resist: ['Grass', 'Fighting', 'Ground'] },
  Rock: { weak: ['Water', 'Grass', 'Fighting', 'Ground', 'Steel'], resist: ['Normal', 'Fire', 'Poison', 'Flying'] },
  Ghost: { weak: ['Ghost', 'Dark'], resist: ['Poison', 'Bug'], immune: ['Normal', 'Fighting'] },
  Dragon: { weak: ['Ice', 'Dragon', 'Fairy'], resist: ['Fire', 'Water', 'Electric', 'Grass'] },
  Dark: { weak: ['Fighting', 'Bug', 'Fairy'], resist: ['Ghost', 'Dark'], immune: ['Psychic'] },
  Steel: { weak: ['Fire', 'Fighting', 'Ground'], resist: ['Normal', 'Grass', 'Ice', 'Flying', 'Psychic', 'Bug', 'Rock', 'Dragon', 'Steel', 'Fairy'], immune: ['Poison'] },
  Fairy: { weak: ['Poison', 'Steel'], resist: ['Fighting', 'Bug', 'Dark'], immune: ['Dragon'] },
};

const roleRules = [
  { role: 'Fake Out', moves: ['Fake Out'] },
  { role: 'Tailwind', moves: ['Tailwind'] },
  { role: 'Trick Room', moves: ['Trick Room'] },
  { role: 'Redirection', moves: ['Rage Powder', 'Follow Me'] },
  { role: 'Intimidate', abilities: ['Intimidate'] },
  { role: 'Weather', moves: ['Sunny Day', 'Rain Dance', 'Sandstorm', 'Snowscape'], abilities: ['Drought', 'Drizzle', 'Sand Stream', 'Snow Warning'] },
  { role: 'Priority', moves: ['Sucker Punch', 'Extreme Speed', 'Aqua Jet', 'Mach Punch', 'Bullet Punch', 'Shadow Sneak', 'Ice Shard', 'Grassy Glide', 'Prankster'] },
];

function renderHeader() {
  $('#generatedAt').textContent = `Generated ${new Date(data.generatedAt).toLocaleString()}`;
  $('#monCount').textContent = `${data.pokemon.length} Pokémon`;
}

function renderTopMeta() {
  const root = $('#topMeta');
  root.innerHTML = '';
  for (const mon of data.topMeta.slice(0, 20)) {
    root.append(el('div', 'rank-row', `
      <span class="badge">#${mon.usage.bo3Rank}</span>
      <div class="mon-line">${sprite(mon.name)}<div><strong>${mon.name}</strong>${chips(mon.types)}</div></div>
      <strong>${pct(mon.usage.bo3Percent)}</strong>
    `));
  }
}

function renderTypeChart() {
  const root = $('#typeChart');
  const max = Math.max(...data.types.map(t => t.weightedUsage));
  root.innerHTML = data.types.slice(0, 12).map(t => `
    <div>
      <div class="bar-label"><strong>${t.type}</strong><span>${t.weightedUsage}</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${(t.weightedUsage / max) * 100}%"></div></div>
    </div>
  `).join('');
}

function renderTopTeams() {
  const root = $('#topTeams');
  root.innerHTML = '';
  for (const team of data.topTeamCombos || []) {
    const examples = (team.examples || []).slice(0, 2).map(example => `
      <a href="${example.team_url}" target="_blank" rel="noreferrer">${example.player} · ${example.record}</a>
    `).join('');
    root.append(el('article', 'team-combo-card', `
      <div class="team-combo-head">
        <span class="badge">Score #${team.rank}</span>
        <strong>${team.winRatePercent.toFixed(2)}% win</strong>
      </div>
      <div class="team-six">
        ${team.pokemon.map(name => `<div class="team-mon">${sprite(name)}<span>${name}</span></div>`).join('')}
      </div>
      <div class="team-metrics">
        <span><strong>${team.wins}-${team.losses}</strong> W-L</span>
        <span><strong>${team.score}</strong> score</span>
        <span><strong>${team.teamsCount}</strong> teams</span>
      </div>
      ${examples ? `<div class="examples">${examples}</div>` : ''}
    `));
  }
}

function renderGholdengoLab() {
  const root = $('#gholdengoLab');
  root.innerHTML = '';
  for (const build of data.gholdengoLab.customBuilds) {
    root.append(el('article', 'card', `
      <h3>${build.name}</h3>
      <div class="chips"><span class="badge">${build.item}</span><span class="badge">${build.nature}</span></div>
      <p><strong>SPs:</strong> ${build.sps}</p>
      <p><strong>Stats:</strong> ${build.stats}</p>
      <p>${build.thesis}</p>
    `));
  }
  root.append(el('article', 'card', `
    <h3>Item Odds Read</h3>
    ${data.gholdengoLab.itemRanking.map(i => `<p><strong>${i.item}</strong> · ${i.score}/100<br><span class="muted">${i.plan}</span></p>`).join('')}
  `));
}

function renderGholdengoMatchups() {
  const root = $('#gholdengoMatchups');
  root.innerHTML = '';
  for (const matchup of data.gholdengoLab.matchups || []) {
    root.append(el('article', 'card', `
      <h3>vs ${matchup.foe}</h3>
      <p><strong>Read:</strong> ${matchup.read}</p>
      <p><strong>Spell Tag:</strong> ${matchup.spellTag}</p>
      <p><strong>Metal Coat:</strong> ${matchup.metalCoat}</p>
    `));
  }
}

function renderArchetypes() {
  const root = $('#archetypes');
  root.innerHTML = '';
  for (const archetype of data.archetypes) {
    root.append(el('article', 'card', `
      <h3>${archetype.name}</h3>
      <span class="badge">${archetype.style}</span>
      ${chips(archetype.core)}
      <p>${archetype.notes}</p>
    `));
  }
}

function renderAntiMeta() {
  const root = $('#antiMeta');
  root.innerHTML = '';
  for (const item of data.antiMeta || []) {
    root.append(el('article', 'card', `
      <h3>Beat ${item.target}</h3>
      <p><strong>Why it wins:</strong> ${item.whyItWins}</p>
      ${chips(item.answers)}
      <p><strong>Plan:</strong> ${item.plan}</p>
    `));
  }
}

function renderLadderNotes() {
  const root = $('#ladderNotes');
  root.innerHTML = '';
  for (const note of data.ladderNotes || []) {
    root.append(el('article', 'card', `<h3>${note.title}</h3><p>${note.note}</p>`));
  }
}

function renderShellGenerator() {
  const select = $('#shellStyle');
  select.innerHTML = (data.teamShells || []).map((shell, index) => `<option value="${index}">${shell.style}</option>`).join('');
  const draw = () => {
    const shell = data.teamShells[Number(select.value || 0)];
    $('#shellOutput').innerHTML = `<article class="card"><h3>${shell.style}</h3>${chips(shell.mons)}<p>${shell.notes}</p></article>`;
  };
  select.addEventListener('change', draw);
  draw();
}

function monMoves(mon) {
  return (mon.chaos?.moves || []).map(move => move.name);
}

function hasRole(mon, rule) {
  const moves = monMoves(mon);
  return (rule.moves || []).some(move => moves.includes(move)) || (rule.abilities || []).some(ability => mon.abilities.includes(ability));
}

function typeMultiplier(defenderTypes, attackingType) {
  let multiplier = 1;
  for (const type of defenderTypes) {
    const chart = typeChart[type] || {};
    if ((chart.immune || []).includes(attackingType)) multiplier *= 0;
    if ((chart.weak || []).includes(attackingType)) multiplier *= 2;
    if ((chart.resist || []).includes(attackingType)) multiplier *= 0.5;
  }
  return multiplier;
}

function analyzeTeam() {
  const mons = selectedTeam.map(name => byName.get(name)).filter(Boolean);
  const allTypes = Object.keys(typeChart);
  const weakCounts = allTypes.map(type => ({ type, count: mons.filter(mon => typeMultiplier(mon.types, type) > 1).length }))
    .filter(row => row.count >= 2)
    .sort((a, b) => b.count - a.count);
  const roleRows = roleRules.map(rule => ({ role: rule.role, mons: mons.filter(mon => hasRole(mon, rule)).map(mon => mon.name) }));
  return { weakCounts, roleRows };
}

function addTeamMon(name) {
  if (selectedTeam.includes(name) || selectedTeam.length >= 6) return;
  selectedTeam.push(name);
  renderTeamBuilder($('#teamSearch').value);
}

function removeTeamMon(name) {
  selectedTeam = selectedTeam.filter(item => item !== name);
  renderTeamBuilder($('#teamSearch').value);
}

function renderTeamBuilder(query = '') {
  const slots = $('#teamSlots');
  slots.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const name = selectedTeam[i];
    const mon = name ? byName.get(name) : null;
    slots.append(el('div', `slot ${mon ? '' : 'empty'}`, mon ? `
      <div class="mon-line">${sprite(mon.name)}<div><strong>${mon.name}</strong>${chips(mon.types)}</div></div>
      <button class="small ghost" data-remove="${mon.name}">×</button>
    ` : `<span>Slot ${i + 1}</span>`));
  }
  slots.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => removeTeamMon(button.dataset.remove)));

  const candidates = data.pokemon
    .filter(mon => matches(mon, query) && !selectedTeam.includes(mon.name))
    .slice(0, 40);
  $('#teamCandidates').innerHTML = candidates.map(mon => `
    <div class="mini-row">
      <div class="mon-line">${sprite(mon.name)}<div><strong>${mon.name}</strong><br><span class="muted">${mon.types.join(' / ')} · ${mon.usage.bo3Rank ? `#${mon.usage.bo3Rank}` : 'unranked'}</span></div></div>
      <button class="small" data-add="${mon.name}">Add</button>
    </div>
  `).join('');
  $('#teamCandidates').querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => addTeamMon(button.dataset.add)));

  const analysis = analyzeTeam();
  const weaknessHtml = analysis.weakCounts.length
    ? analysis.weakCounts.map(row => `<p class="warning"><strong>${row.type}</strong>: ${row.count} team members weak</p>`).join('')
    : '<p class="good">No shared 2+ weaknesses flagged yet.</p>';
  const rolesHtml = analysis.roleRows.map(row => row.mons.length
    ? `<p class="good"><strong>${row.role}</strong>: ${row.mons.join(', ')}</p>`
    : `<p class="warning"><strong>${row.role}</strong>: missing</p>`).join('');
  $('#teamAnalysis').innerHTML = `
    <article class="analysis-card"><h3>Shared Weaknesses</h3>${weaknessHtml}</article>
    <article class="analysis-card"><h3>Role Checklist</h3>${rolesHtml}</article>
  `;
}

function matches(mon, query) {
  if (!query) return true;
  const haystack = [mon.name, ...mon.types, ...mon.abilities, ...monMoves(mon)].join(' ').toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function renderPokemonGrid(query = '') {
  const root = $('#pokemonGrid');
  root.innerHTML = '';
  const mons = data.pokemon.filter(mon => matches(mon, query)).slice(0, 120);
  for (const mon of mons) {
    const rank = mon.usage.bo3Rank ? `#${mon.usage.bo3Rank} · ${pct(mon.usage.bo3Percent)}` : 'Unranked';
    const card = el('article', 'mon-card', `
      <div class="mon-line big">${sprite(mon.name)}<h3>${mon.name}</h3></div>
      ${chips(mon.types)}
      <p class="muted">${rank}</p>
      <div class="stats">
        <span>HP ${mon.baseStats.hp}</span><span>Def ${mon.baseStats.def}</span><span>SpA ${mon.baseStats.spa}</span>
        <span>Atk ${mon.baseStats.atk}</span><span>SpD ${mon.baseStats.spd}</span><span>Spe ${mon.baseStats.spe}</span>
      </div>
    `);
    card.addEventListener('click', () => showDetails(mon));
    root.append(card);
  }
}

function listSection(title, rows, formatter = row => `${row.name}: ${row.value}`) {
  if (!rows?.length) return `<article class="card"><h3>${title}</h3><p class="muted">No data yet.</p></article>`;
  return `<article class="card"><h3>${title}</h3>${rows.map(row => `<p>${formatter(row)}</p>`).join('')}</article>`;
}

function strategySection(mon) {
  const sets = mon.strategy?.sets || [];
  if (!sets.length) return listSection('Smogon Sets', []);
  return `<article class="card"><h3>Smogon Sets</h3>${sets.map(set => `
    <p><strong>${set.name}</strong> <span class="muted">${set.format}</span><br>
    Items: ${(set.items || []).join(', ') || '—'}<br>
    Natures: ${(set.natures || []).join(', ') || '—'}</p>
  `).join('')}<a href="${mon.smogonUrl}" target="_blank" rel="noreferrer">Open Smogon page</a></article>`;
}

function showDetails(mon) {
  $('#details').innerHTML = `
    <div class="mon-line big">${sprite(mon.name)}<h2>${mon.name}</h2></div>
    ${chips(mon.types)}
    <p class="muted">Abilities: ${mon.abilities.join(', ') || '—'} · BO3: ${mon.usage.bo3Rank ? `#${mon.usage.bo3Rank} (${pct(mon.usage.bo3Percent)})` : 'Unranked'}</p>
    <div class="detail-grid">
      ${listSection('Common Items', mon.chaos?.items)}
      ${listSection('Common Moves', mon.chaos?.moves)}
      ${listSection('Common Teammates', mon.chaos?.teammates)}
      ${listSection('Checks / Counters', mon.chaos?.checks)}
      ${listSection('Common Spreads', mon.chaos?.spreads)}
      ${strategySection(mon)}
    </div>
  `;
  $('#detailsDialog').showModal();
}

function boot() {
  renderHeader();
  renderTopMeta();
  renderTypeChart();
  renderTopTeams();
  renderTeamBuilder();
  renderAntiMeta();
  renderGholdengoLab();
  renderGholdengoMatchups();
  renderShellGenerator();
  renderLadderNotes();
  renderArchetypes();
  renderPokemonGrid();
  $('#teamSearch').addEventListener('input', event => renderTeamBuilder(event.target.value));
  $('#search').addEventListener('input', event => renderPokemonGrid(event.target.value));
  $('#closeDialog').addEventListener('click', () => $('#detailsDialog').close());
}

boot();
