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
      <div><strong>${mon.name}</strong>${chips(mon.types)}</div>
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

function matches(mon, query) {
  if (!query) return true;
  const haystack = [mon.name, ...mon.types, ...mon.abilities, ...(mon.chaos?.moves || []).map(m => m.name)].join(' ').toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function renderPokemonGrid(query = '') {
  const root = $('#pokemonGrid');
  root.innerHTML = '';
  const mons = data.pokemon.filter(mon => matches(mon, query)).slice(0, 120);
  for (const mon of mons) {
    const rank = mon.usage.bo3Rank ? `#${mon.usage.bo3Rank} · ${pct(mon.usage.bo3Percent)}` : 'Unranked';
    const card = el('article', 'mon-card', `
      <h3>${mon.name}</h3>
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
    <h2>${mon.name}</h2>
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
  renderGholdengoLab();
  renderArchetypes();
  renderPokemonGrid();
  $('#search').addEventListener('input', event => renderPokemonGrid(event.target.value));
  $('#closeDialog').addEventListener('click', () => $('#detailsDialog').close());
}

boot();
