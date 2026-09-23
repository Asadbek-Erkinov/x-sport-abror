const matchData = [
  // Verified UEFA Champions League 2025/26 knockout results.
  { id: 1, sport: "football", league: "UEFA CHAMPIONS LEAGUE", stage: "FINAL", date: "30 MAY 2026", home: "Paris Saint-Germain", away: "Arsenal", homeShort: "PSG", awayShort: "ARS", homeScore: 1, awayScore: 1, note: "Penalties 4–3", status: "FT", leagueKey: "ucl" },
  { id: 2, sport: "football", league: "UEFA CHAMPIONS LEAGUE", stage: "SEMI-FINAL · 2ND LEG", date: "06 MAY 2026", home: "Bayern München", away: "Paris Saint-Germain", homeShort: "BAY", awayShort: "PSG", homeScore: 1, awayScore: 1, note: "Aggregate 5–6", status: "FT", leagueKey: "ucl" },
  { id: 3, sport: "football", league: "UEFA CHAMPIONS LEAGUE", stage: "SEMI-FINAL · 2ND LEG", date: "05 MAY 2026", home: "Arsenal", away: "Atlético de Madrid", homeShort: "ARS", awayShort: "ATM", homeScore: 1, awayScore: 0, note: "Aggregate 2–1", status: "FT", leagueKey: "ucl" },
  { id: 4, sport: "football", league: "UEFA CHAMPIONS LEAGUE", stage: "QUARTER-FINAL · 2ND LEG", date: "15 APR 2026", home: "Bayern München", away: "Real Madrid", homeShort: "BAY", awayShort: "RMA", homeScore: 4, awayScore: 3, note: "Aggregate 6–4", status: "FT", leagueKey: "ucl" },
  { id: 5, sport: "football", league: "UEFA CHAMPIONS LEAGUE", stage: "ROUND OF 16 · 2ND LEG", date: "18 MAR 2026", home: "Barcelona", away: "Newcastle United", homeShort: "BAR", awayShort: "NEW", homeScore: 7, awayScore: 2, note: "Aggregate 8–3", status: "FT", leagueKey: "ucl" },
  { id: 6, sport: "football", league: "PREMIER LEAGUE", stage: "FINAL TABLE", date: "2025/26 SEASON", home: "Arsenal", away: "Manchester City", homeShort: "ARS", awayShort: "MCI", homeScore: null, awayScore: null, note: "Arsenal champions · 85 pts", status: "TABLE", leagueKey: "pl" },
  { id: 7, sport: "football", league: "LALIGA EA SPORTS", stage: "FINAL TABLE", date: "2025/26 SEASON", home: "Barcelona", away: "Real Madrid", homeShort: "BAR", awayShort: "RMA", homeScore: null, awayScore: null, note: "Barcelona champions · 94 pts", status: "TABLE", leagueKey: "laliga" },
  { id: 8, sport: "football", league: "BUNDESLIGA", stage: "FINAL TABLE", date: "2025/26 SEASON", home: "Bayern München", away: "Borussia Dortmund", homeShort: "BAY", awayShort: "BVB", homeScore: null, awayScore: null, note: "Bayern champions · 89 pts", status: "TABLE", leagueKey: "bundesliga" },
  { id: 9, sport: "basketball", league: "NBA", stage: "2025/26", date: "SEASON DATA", home: "NBA", away: "Standings", homeShort: "NBA", awayShort: "NBA", homeScore: null, awayScore: null, note: "Basketbol bo‘limi", status: "INFO", leagueKey: "nba" },
  { id: 10, sport: "tennis", league: "ATP", stage: "TOUR", date: "2026", home: "ATP Tour", away: "Results", homeShort: "ATP", awayShort: "ATP", homeScore: null, awayScore: null, note: "Turnir natijalari", status: "INFO", leagueKey: "tennis" }
];

const standings = {
  pl: {
    name: "Premier League", season: "2025/26", cols: ["P", "W", "D", "L", "GD", "PTS"],
    rows: [
      ["Arsenal",38,26,7,5,"+44",85], ["Manchester City",38,23,9,6,"+42",78], ["Manchester United",38,20,11,7,"+19",71], ["Aston Villa",38,19,8,11,"+7",65], ["Liverpool",38,17,9,12,"+10",60]
    ]
  },
  laliga: {
    name: "LALIGA EA SPORTS", season: "2025/26", cols: ["P", "W", "D", "L", "GD", "PTS"],
    rows: [
      ["Barcelona",38,31,1,6,"+59",94], ["Real Madrid",38,27,5,6,"+42",86], ["Villarreal",38,22,6,10,"+26",72], ["Atlético de Madrid",38,21,6,11,"+18",69], ["Real Betis",38,15,15,8,"+11",60]
    ]
  },
  bundesliga: {
    name: "Bundesliga", season: "2025/26", cols: ["P", "W", "D", "L", "GD", "PTS"],
    rows: [
      ["Bayern München",34,28,5,1,"+86",89], ["Borussia Dortmund",34,22,7,5,"+36",73], ["RB Leipzig",34,20,5,9,"+19",65], ["VfB Stuttgart",34,18,8,8,"+22",62], ["Hoffenheim",34,18,7,9,"+13",61]
    ]
  },
  ucl: {
    name: "UEFA Champions League", season: "2025/26", cols: ["MP", "W", "D", "L", "GD", "PTS"],
    rows: [
      ["Arsenal",8,8,0,0,"+13",24], ["Bayern München",8,5,1,2,"+8",16], ["Barcelona",8,5,1,2,"+10",16], ["Paris Saint-Germain",8,4,2,2,"+10",14], ["Atlético de Madrid",8,4,2,2,"+3",14]
    ]
  }
};

const matchList = document.getElementById("matchList");
const standingsList = document.getElementById("standingsList");
const tabs = document.querySelectorAll(".sport-tab");
const leagueTabs = document.querySelectorAll(".league-tab");
const resultNotice = document.getElementById("resultNotice");

function badge(code, sport = "football") {
  return `<span class="team-badge ${sport}">${code}</span>`;
}

function renderMatches(filter = "all") {
  const visible = filter === "all" ? matchData : matchData.filter(item => item.sport === filter);
  matchList.innerHTML = visible.map(match => {
    const isScore = Number.isInteger(match.homeScore) && Number.isInteger(match.awayScore);
    return `<article class="real-match-card">
      <div class="real-match-head">
        <div><span class="league-dot"></span><strong>${match.league}</strong><small>${match.stage}</small></div>
        <div class="match-date"><b>${match.status}</b><span>${match.date}</span></div>
      </div>
      <div class="real-match-body">
        <div class="real-team home">${badge(match.homeShort, match.sport)}<strong>${match.home}</strong><span>HOME</span></div>
        <div class="real-score">${isScore ? `<strong>${match.homeScore} <i>—</i> ${match.awayScore}</strong>` : `<strong class="table-score">TABLE</strong>`}<small>${match.note}</small></div>
        <div class="real-team away">${badge(match.awayShort, match.sport)}<strong>${match.away}</strong><span>AWAY</span></div>
      </div>
    </article>`;
  }).join("");
}

// Local result updates: points are recalculated in the selected league table.
const resultForm = document.getElementById("resultForm");
const clearLocalResults = document.getElementById("clearLocalResults");
const LOCAL_KEY = "aiSportXLocalResults";

function getLocalResults(){
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); }
  catch { return []; }
}
function saveLocalResults(items){ localStorage.setItem(LOCAL_KEY, JSON.stringify(items)); }
function normalized(name){ return String(name).trim().toLowerCase(); }

function renderStandings(key = "pl") {
  const table = standings[key];
  if (!table) return;
  const local = getLocalResults().filter(x => x.league === key);
  const rows = table.rows.map(r => ({name:r[0], p:r[1], w:r[2], d:r[3], l:r[4], gd:Number(String(r[5]).replace('+','')) || 0, pts:r[6]}));
  local.forEach(result => {
    const home = rows.find(r => normalized(r.name) === normalized(result.home));
    const away = rows.find(r => normalized(r.name) === normalized(result.away));
    if (!home || !away) return;
    home.p++; away.p++;
    home.gd += result.hs - result.as; away.gd += result.as - result.hs;
    if (result.hs > result.as) { home.w++; home.pts += 3; away.l++; }
    else if (result.hs < result.as) { away.w++; away.pts += 3; home.l++; }
    else { home.d++; away.d++; home.pts++; away.pts++; }
  });
  rows.sort((a,b) => b.pts-a.pts || b.gd-a.gd);
  document.getElementById("standingsTitle").textContent = table.name;
  document.getElementById("standingsSeason").textContent = table.season + (local.length ? " · LIVE" : "");
  standingsList.innerHTML = `<div class="standings-head"><span>#</span><span>JAMOA</span>${table.cols.map(c => `<span>${c}</span>`).join("")}</div>` +
    rows.map((r, i) => `<div class="standing-row"><b>${i+1}</b><span class="standing-team">${badge(r.name.slice(0,3).toUpperCase())}${r.name}</span><span class="standing-stat">${r.p}</span><span class="standing-stat">${r.w}</span><span class="standing-stat">${r.d}</span><span class="standing-stat">${r.l}</span><span class="standing-stat">${r.gd >= 0 ? '+' : ''}${r.gd}</span><span class="standing-stat points">${r.pts}</span></div>`).join("");
}

resultForm?.addEventListener("submit", e => {
  e.preventDefault();
  const item = {
    league: document.getElementById("resultLeague").value,
    home: document.getElementById("resultHome").value.trim(),
    away: document.getElementById("resultAway").value.trim(),
    hs: Number(document.getElementById("resultHomeScore").value),
    as: Number(document.getElementById("resultAwayScore").value)
  };
  const table = standings[item.league];
  if (!table) return;
  const validNames = table.rows.map(r => normalized(r[0]));
  if (!validNames.includes(normalized(item.home)) || !validNames.includes(normalized(item.away)) || normalized(item.home) === normalized(item.away)) {
    alert("Jamoa nomini jadvaldagi nom bilan aynan bir xil yozing. Masalan: Arsenal");
    return;
  }
  const local = getLocalResults();
  local.push(item);
  saveLocalResults(local);
  renderStandings(item.league);
  leagueTabs.forEach(x => x.classList.toggle("active", x.dataset.league === item.league));
  document.getElementById("resultNotice").innerHTML = `<strong>LIVE UPDATE</strong><span>${item.home} ${item.hs} — ${item.as} ${item.away}: ochkolar jadvali avtomatik yangilandi.</span>`;
  resultForm.reset();
});

clearLocalResults?.addEventListener("click", () => {
  localStorage.removeItem(LOCAL_KEY);
  renderStandings(document.querySelector(".league-tab.active")?.dataset.league || "pl");
  document.getElementById("resultNotice").innerHTML = `<strong>REAL MA’LUMOT</strong><span>Rasmiy 2025/26 jadvali tiklandi.</span>`;
});

tabs.forEach(tab => tab.addEventListener("click", () => {
  tabs.forEach(x => x.classList.remove("active"));
  tab.classList.add("active");
  renderMatches(tab.dataset.sport);
}));
leagueTabs.forEach(tab => tab.addEventListener("click", () => {
  leagueTabs.forEach(x => x.classList.remove("active"));
  tab.classList.add("active");
  renderStandings(tab.dataset.league);
}));

renderMatches();
renderStandings("pl");
