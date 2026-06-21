const groups = [
  { id: "A", teams: [["México", "🇲🇽"], ["Sudáfrica", "🇿🇦"], ["Corea del Sur", "🇰🇷"], ["Chequia", "🇨🇿"]] },
  { id: "B", teams: [["Canadá", "🇨🇦"], ["Bosnia y Herzegovina", "🇧🇦"], ["Qatar", "🇶🇦"], ["Suiza", "🇨🇭"]] },
  { id: "C", teams: [["Brasil", "🇧🇷"], ["Marruecos", "🇲🇦"], ["Haití", "🇭🇹"], ["Escocia", "🏴"]] },
  { id: "D", teams: [["Estados Unidos", "🇺🇸"], ["Paraguay", "🇵🇾"], ["Australia", "🇦🇺"], ["Turquía", "🇹🇷"]] },
  { id: "E", teams: [["Alemania", "🇩🇪"], ["Curazao", "🇨🇼"], ["Costa de Marfil", "🇨🇮"], ["Ecuador", "🇪🇨"]] },
  { id: "F", teams: [["Países Bajos", "🇳🇱"], ["Japón", "🇯🇵"], ["Suecia", "🇸🇪"], ["Túnez", "🇹🇳"]] },
  { id: "G", teams: [["Bélgica", "🇧🇪"], ["Egipto", "🇪🇬"], ["Irán", "🇮🇷"], ["Nueva Zelanda", "🇳🇿"]] },
  { id: "H", teams: [["España", "🇪🇸"], ["Cabo Verde", "🇨🇻"], ["Arabia Saudita", "🇸🇦"], ["Uruguay", "🇺🇾"]] },
  { id: "I", teams: [["Francia", "🇫🇷"], ["Senegal", "🇸🇳"], ["Irak", "🇮🇶"], ["Noruega", "🇳🇴"]] },
  { id: "J", teams: [["Argentina", "🇦🇷"], ["Argelia", "🇩🇿"], ["Austria", "🇦🇹"], ["Jordania", "🇯🇴"]] },
  { id: "K", teams: [["Portugal", "🇵🇹"], ["RD Congo", "🇨🇩"], ["Uzbekistán", "🇺🇿"], ["Colombia", "🇨🇴"]] },
  { id: "L", teams: [["Inglaterra", "🏴"], ["Croacia", "🇭🇷"], ["Ghana", "🇬🇭"], ["Panamá", "🇵🇦"]] }
];

const roundOf32 = [
  ["M73", "2A", "2B"],
  ["M74", "1E", "3:A/B/C/D/F"],
  ["M75", "1F", "2C"],
  ["M76", "1C", "2F"],
  ["M77", "1I", "3:C/D/F/G/H"],
  ["M78", "2E", "2I"],
  ["M79", "1A", "3:C/E/F/H/I"],
  ["M80", "1L", "3:E/H/I/J/K"],
  ["M81", "1D", "3:B/E/F/I/J"],
  ["M82", "1G", "3:A/E/H/I/J"],
  ["M83", "2K", "2L"],
  ["M84", "1H", "2J"],
  ["M85", "1B", "3:E/F/G/I/J"],
  ["M86", "1J", "2H"],
  ["M87", "1K", "3:D/E/I/J/L"],
  ["M88", "2D", "2G"]
];

const laterRounds = [
  { title: "Octavos", matches: [["M89", "M73", "M75"], ["M90", "M74", "M77"], ["M91", "M76", "M78"], ["M92", "M79", "M80"], ["M93", "M83", "M84"], ["M94", "M81", "M82"], ["M95", "M86", "M88"], ["M96", "M85", "M87"]] },
  { title: "Cuartos", matches: [["M97", "M89", "M90"], ["M98", "M93", "M94"], ["M99", "M91", "M92"], ["M100", "M95", "M96"]] },
  { title: "Semifinales", matches: [["M101", "M97", "M98"], ["M102", "M99", "M100"]] },
  { title: "Final", matches: [["M104", "M101", "M102"]] }
];

const groupPairings = [[0, 1], [2, 3], [0, 2], [3, 1], [3, 0], [1, 2]];
const scores = {};
const picks = {};
const teamMap = new Map();
let activeGroupId = groups[0].id;

groups.forEach(group => {
  group.teams.forEach(([name, flag]) => teamMap.set(name, { name, flag, group: group.id }));
});

function getTeam(name) {
  return teamMap.get(name) || { name, flag: "🏳️", group: "" };
}

function makeMatches() {
  return groups.flatMap(group => groupPairings.map((pair, index) => {
    const home = group.teams[pair[0]][0];
    const away = group.teams[pair[1]][0];
    return { id: `${group.id}-${index + 1}`, group: group.id, date: getMatchDate(group.id, index), home, away };
  }));
}

function getMatchDate(groupId, index) {
  const base = {
    A: ["11 junio", "12 junio", "18 junio", "18 junio", "24 junio", "24 junio"],
    B: ["12 junio", "13 junio", "18 junio", "19 junio", "24 junio", "24 junio"],
    C: ["13 junio", "13 junio", "19 junio", "20 junio", "24 junio", "24 junio"],
    D: ["12 junio", "13 junio", "19 junio", "19 junio", "25 junio", "25 junio"],
    E: ["14 junio", "14 junio", "20 junio", "20 junio", "25 junio", "25 junio"],
    F: ["14 junio", "14 junio", "20 junio", "20 junio", "25 junio", "25 junio"],
    G: ["15 junio", "15 junio", "21 junio", "21 junio", "26 junio", "26 junio"],
    H: ["15 junio", "15 junio", "21 junio", "21 junio", "26 junio", "26 junio"],
    I: ["16 junio", "16 junio", "22 junio", "22 junio", "26 junio", "26 junio"],
    J: ["16 junio", "16 junio", "22 junio", "22 junio", "27 junio", "27 junio"],
    K: ["17 junio", "17 junio", "23 junio", "23 junio", "27 junio", "27 junio"],
    L: ["17 junio", "17 junio", "23 junio", "23 junio", "27 junio", "27 junio"]
  };
  return base[groupId][index];
}

const matches = makeMatches();

function renderGroups() {
  document.querySelector("#groups-grid").innerHTML = groups.map(group => `
    <article class="group-card">
      <div class="group-head"><strong>Grupo ${group.id}</strong><span>4 equipos</span></div>
      <ul class="group-list">
        ${group.teams.map(([name, flag]) => `<li class="team-row"><span class="flag">${flag}</span>${name}</li>`).join("")}
      </ul>
    </article>
  `).join("");
}

function renderGroupSwitcher() {
  document.querySelector("#group-switcher").innerHTML = groups.map(group => `
    <button class="group-tab ${group.id === activeGroupId ? "is-active" : ""}" type="button" data-group="${group.id}">
      Grupo ${group.id}
    </button>
  `).join("");
}

function renderMatches() {
  document.querySelector("#matches-grid").innerHTML = matches.filter(match => match.group === activeGroupId).map(match => {
    const home = getTeam(match.home);
    const away = getTeam(match.away);
    const current = scores[match.id] || {};
    return `
      <article class="match-card">
        <div class="match-meta"><span>Grupo ${match.group}</span><span>${match.date}</span></div>
        <div class="score-line">
          <div class="score-team"><span class="flag">${home.flag}</span><span>${home.name}</span></div>
          <input type="number" min="0" max="30" inputmode="numeric" data-match="${match.id}" data-side="home" value="${current.home ?? ""}" aria-label="Goles de ${home.name}">
          <span class="versus">vs</span>
          <input type="number" min="0" max="30" inputmode="numeric" data-match="${match.id}" data-side="away" value="${current.away ?? ""}" aria-label="Goles de ${away.name}">
          <div class="score-team"><span>${away.name}</span><span class="flag">${away.flag}</span></div>
        </div>
      </article>
    `;
  }).join("");
  renderActiveGroupTable();
}

function emptyStats(team, group) {
  return { team, group, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 };
}

function calculateTables() {
  const tables = {};
  groups.forEach(group => {
    tables[group.id] = group.teams.map(([name]) => emptyStats(name, group.id));
  });

  matches.forEach(match => {
    const result = scores[match.id];
    if (!isCompleteResult(result)) return;

    const home = tables[match.group].find(row => row.team === match.home);
    const away = tables[match.group].find(row => row.team === match.away);
    home.pj += 1;
    away.pj += 1;
    home.gf += result.home;
    home.gc += result.away;
    away.gf += result.away;
    away.gc += result.home;

    if (result.home > result.away) {
      home.pg += 1;
      away.pp += 1;
      home.pts += 3;
    } else if (result.home < result.away) {
      away.pg += 1;
      home.pp += 1;
      away.pts += 3;
    } else {
      home.pe += 1;
      away.pe += 1;
      home.pts += 1;
      away.pts += 1;
    }
  });

  Object.values(tables).forEach(rows => rows.forEach(row => row.dg = row.gf - row.gc));
  Object.keys(tables).forEach(groupId => tables[groupId].sort(sortTeams));
  return tables;
}

function sortTeams(a, b) {
  return b.pts - a.pts || b.dg - a.dg || b.gf - a.gf || a.team.localeCompare(b.team);
}

function isCompleteResult(result) {
  return result && Number.isInteger(result.home) && Number.isInteger(result.away);
}

function renderTables() {
  const tables = calculateTables();
  const bestThirds = getBestThirds(tables);
  const bestThirdNames = new Set(bestThirds.slice(0, 8).map(row => row.team));

  document.querySelector("#tables-grid").innerHTML = Object.entries(tables).map(([groupId, rows]) => `
    <article class="table-card">
      <div class="table-head"><strong>Grupo ${groupId}</strong><span>Tabla</span></div>
      ${renderTable(rows, bestThirdNames)}
    </article>
  `).join("");

  document.querySelector("#thirds-table").innerHTML = renderTable(bestThirds, bestThirdNames, true);
  renderActiveGroupTable(tables, bestThirdNames);
  updateStatus(tables);
}

function renderActiveGroupTable(currentTables, currentBestThirdNames) {
  const tableContainer = document.querySelector("#active-group-table");
  if (!tableContainer) return;

  const tables = currentTables || calculateTables();
  const bestThirdNames = currentBestThirdNames || new Set(getBestThirds(tables).slice(0, 8).map(row => row.team));

  tableContainer.innerHTML = `
    <div class="table-head"><strong>Grupo ${activeGroupId}</strong><span>En vivo</span></div>
    ${renderTable(tables[activeGroupId], bestThirdNames)}
  `;
}

function renderTable(rows, bestThirdNames, isThirds = false) {
  return `
    <table>
      <thead>
        <tr>
          <th>Equipo</th><th>PTS</th><th>PJ</th><th>GF</th><th>GC</th><th>DG</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((row, index) => {
          const team = getTeam(row.team);
          const className = !isThirds && index < 2 ? "qualified" : bestThirdNames.has(row.team) ? "third-qualified" : "";
          return `
            <tr class="${className}">
              <td><span class="team-cell"><span class="flag">${team.flag}</span><span class="team-name">${row.team}</span></span></td>
              <td>${row.pts}</td><td>${row.pj}</td><td>${row.gf}</td><td>${row.gc}</td><td>${row.dg}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

function getBestThirds(tables) {
  return Object.values(tables).map(rows => rows[2]).sort(sortTeams);
}

function getQualifiers(tables) {
  const qualifiers = {};
  Object.entries(tables).forEach(([groupId, rows]) => {
    qualifiers[`1${groupId}`] = rows[0];
    qualifiers[`2${groupId}`] = rows[1];
  });

  const thirds = getBestThirds(tables).slice(0, 8);
  const thirdSlots = roundOf32.flatMap(([, , slot]) => slot.startsWith("3:") ? [slot] : []);
  const thirdAssignments = assignThirdPlaceSlots(thirdSlots, thirds);

  Object.entries(thirdAssignments).forEach(([slot, team]) => {
    qualifiers[slot] = team;
  });

  return qualifiers;
}

function assignThirdPlaceSlots(slots, thirds) {
  const choicesBySlot = slots.map(slot => ({
    slot,
    allowedGroups: slot.replace("3:", "").split("/")
  }));
  const orderedSlots = [...choicesBySlot].sort((a, b) => {
    const aChoices = thirds.filter(row => a.allowedGroups.includes(row.group)).length;
    const bChoices = thirds.filter(row => b.allowedGroups.includes(row.group)).length;
    return aChoices - bChoices;
  });
  const assignments = {};
  const usedGroups = new Set();

  function assign(index) {
    if (index === orderedSlots.length) return true;

    const current = orderedSlots[index];
    const candidates = thirds.filter(row => current.allowedGroups.includes(row.group) && !usedGroups.has(row.group));

    for (const candidate of candidates) {
      assignments[current.slot] = candidate;
      usedGroups.add(candidate.group);

      if (assign(index + 1)) return true;

      usedGroups.delete(candidate.group);
      delete assignments[current.slot];
    }

    return false;
  }

  assign(0);
  return assignments;
}

function renderBracket() {
  const tables = calculateTables();
  const complete = matches.every(match => isCompleteResult(scores[match.id]));
  const qualifiers = complete ? getQualifiers(tables) : {};
  const bracketRounds = [
    { title: "Dieciseisavos", matches: roundOf32 },
    ...laterRounds
  ];
  const leftRounds = [
    { title: "Dieciseisavos", matches: bracketRounds[0].matches.slice(0, 8) },
    { title: "Octavos", matches: bracketRounds[1].matches.slice(0, 4) },
    { title: "Cuartos", matches: bracketRounds[2].matches.slice(0, 2) },
    { title: "Semifinal", matches: bracketRounds[3].matches.slice(0, 1) }
  ];
  const rightRounds = [
    { title: "Semifinal", matches: bracketRounds[3].matches.slice(1, 2) },
    { title: "Cuartos", matches: bracketRounds[2].matches.slice(2, 4) },
    { title: "Octavos", matches: bracketRounds[1].matches.slice(4, 8) },
    { title: "Dieciseisavos", matches: bracketRounds[0].matches.slice(8, 16) }
  ];
  const finalRound = { title: "Final", matches: bracketRounds[4].matches };

  document.querySelector("#bracket").innerHTML = `
    <div class="bracket-side bracket-side-left">
      ${leftRounds.map(round => renderBracketRound(round, qualifiers, complete)).join("")}
    </div>
    <div class="bracket-final">
      ${renderBracketRound(finalRound, qualifiers, complete)}
    </div>
    <div class="bracket-side bracket-side-right">
      ${rightRounds.map(round => renderBracketRound(round, qualifiers, complete)).join("")}
    </div>
  `;
}

function renderBracketRound(round, qualifiers, complete) {
  return `
    <section class="bracket-round">
      <h3>${round.title}</h3>
      ${round.matches.map(([id, a, b]) => renderBracketMatch(id, resolveSlot(a, qualifiers), resolveSlot(b, qualifiers), complete)).join("")}
    </section>
  `;
}

function resolveSlot(slot, qualifiers) {
  if (slot.startsWith("M")) {
    return picks[slot] ? { team: picks[slot], source: `Ganador ${slot}` } : { team: "", source: `Ganador ${slot}` };
  }

  const row = qualifiers[slot];
  if (row) return { team: row.team, source: slot };
  return { team: "", source: slot };
}

function renderBracketMatch(id, a, b, complete) {
  const disabledA = !complete || !a.team;
  const disabledB = !complete || !b.team;
  return `
    <div class="bracket-match">
      <small>${id}</small>
      ${renderPick(id, a, disabledA)}
      ${renderPick(id, b, disabledB)}
    </div>
  `;
}

function renderPick(matchId, side, disabled) {
  const team = side.team ? getTeam(side.team) : { flag: "•", name: side.source };
  const isWinner = picks[matchId] === side.team && side.team;
  return `
    <button class="pick ${isWinner ? "is-winner" : ""}" type="button" data-pick="${matchId}" data-team="${side.team}" ${disabled ? "disabled" : ""}>
      <span class="flag">${team.flag}</span> ${team.name}
    </button>
  `;
}

function renderCalendar() {
  const byDate = matches.reduce((acc, match) => {
    acc[match.date] = acc[match.date] || [];
    acc[match.date].push(match);
    return acc;
  }, {});

  document.querySelector("#calendar").innerHTML = Object.entries(byDate).map(([date, dateMatches]) => {
    const [day, month] = date.split(" ");
    return `
      <article class="calendar-day">
        <div class="date-box"><span>${month}</span><strong>${day}</strong></div>
        <div class="calendar-games">
          ${dateMatches.map(match => {
            const home = getTeam(match.home);
            const away = getTeam(match.away);
            return `
              <div class="calendar-game">
                <small>Grupo ${match.group}</small>
                <div class="team-row"><span class="flag">${home.flag}</span>${home.name}</div>
                <div class="team-row"><span class="flag">${away.flag}</span>${away.name}</div>
              </div>
            `;
          }).join("")}
        </div>
      </article>
    `;
  }).join("");
}

function updateStatus(tables) {
  const played = matches.filter(match => isCompleteResult(scores[match.id])).length;
  const total = matches.length;
  const complete = played === total;
  const status = document.querySelector("#simulation-status");
  status.textContent = complete
    ? "Fase de grupos completa. Ya puedes elegir ganadores en los cruces."
    : `Marcadores ingresados: ${played}/${total}. Faltan ${total - played}.`;
}

function syncAll() {
  renderTables();
  renderBracket();
}

document.addEventListener("input", event => {
  if (!event.target.matches("[data-match]")) return;

  const matchId = event.target.dataset.match;
  const side = event.target.dataset.side;
  scores[matchId] = scores[matchId] || {};

  if (event.target.value === "") {
    delete scores[matchId][side];
  } else {
    scores[matchId][side] = Number(event.target.value);
  }

  Object.keys(picks).forEach(key => delete picks[key]);
  syncAll();
});

document.addEventListener("click", event => {
  if (event.target.closest(".brand")) {
    showHome();
    return;
  }

  const viewLink = event.target.closest(".view-link");
  if (viewLink) {
    showView(viewLink.dataset.view);
  }

  const groupButton = event.target.closest("[data-group]");
  if (groupButton) {
    activeGroupId = groupButton.dataset.group;
    renderGroupSwitcher();
    renderMatches();
  }

  if (event.target.matches(".tab")) {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("is-active"));
    document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("is-active"));
    event.target.classList.add("is-active");
    document.querySelector(`#tab-${event.target.dataset.tab}`).classList.add("is-active");
  }

  const pickButton = event.target.closest("[data-pick]");
  if (pickButton && pickButton.dataset.team) {
    picks[pickButton.dataset.pick] = pickButton.dataset.team;
    renderBracket();
  }
});

function showView(viewId) {
  if (!viewId) return;

  document.querySelector(".hero").classList.add("is-hidden");
  document.querySelectorAll(".app-view").forEach(section => {
    section.classList.toggle("is-active", section.id === viewId);
  });
  document.querySelectorAll(".view-link").forEach(link => {
    link.classList.toggle("is-active", link.dataset.view === viewId);
  });
}

function initView() {
  const initialView = window.location.hash.replace("#", "");
  if (["grupos", "simulador", "calendario"].includes(initialView)) {
    showView(initialView);
    return;
  }

  showHome();
}

function showHome() {
  document.querySelector(".hero").classList.remove("is-hidden");
  document.querySelectorAll(".app-view").forEach(section => section.classList.remove("is-active"));
  document.querySelectorAll(".view-link").forEach(link => link.classList.remove("is-active"));
}

document.querySelector("#random-fill").addEventListener("click", () => {
  matches.forEach(match => {
    scores[match.id] = {
      home: Math.floor(Math.random() * 5),
      away: Math.floor(Math.random() * 5)
    };
  });
  Object.keys(picks).forEach(key => delete picks[key]);
  renderMatches();
  syncAll();
});

document.querySelector("#reset-sim").addEventListener("click", () => {
  Object.keys(scores).forEach(key => delete scores[key]);
  Object.keys(picks).forEach(key => delete picks[key]);
  renderMatches();
  syncAll();
});

renderGroups();
renderGroupSwitcher();
renderMatches();
renderTables();
renderBracket();
renderCalendar();
initView();
