import './style.css'

const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:5000') + '/api';
let playerName: string = "";
let bucketId: string = "";
let seDifficulty: number = 4.0;
let referenceTime: number = 0;

let currentGrid: number[][] = [];
let solution: number[][] = [];
let selectedCell: { r: number, c: number } | null = null;
let timer: number = 0;
let timerInterval: any = null;

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
});

function setupEventListeners() {
  // Modal de démarrage
  document.getElementById('start-game-btn')?.addEventListener('click', () => {
    const input = document.getElementById('player-name-input') as HTMLInputElement;
    if (input.value.trim().length >= 3) {
      playerName = input.value.trim();
      document.getElementById('player-modal')!.style.display = 'none';
      document.getElementById('player-display')!.textContent = playerName;
      initTournamentGame();
    } else {
      alert("Pseudo trop court (3 chars min)");
    }
  });

  // Sélection de cellule
  document.getElementById('grid-container')?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('cell')) {
      selectCell(parseInt(target.dataset.row!), parseInt(target.dataset.col!));
    }
  });

  // Pavé numérique
  document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (selectedCell) fillCell(selectedCell.r, selectedCell.c, parseInt(btn.textContent!));
    });
  });

  // Effacer
  document.getElementById('erase-btn')?.addEventListener('click', () => {
    if (selectedCell) fillCell(selectedCell.r, selectedCell.c, 0);
  });

  // Nouvelle partie (rejoint un nouveau tournoi)
  document.getElementById('new-game-btn')?.addEventListener('click', initTournamentGame);

  // --- PERSONNALISATION ---
  const bgUpload = document.getElementById('bg-upload') as HTMLInputElement;
  const bgOpacity = document.getElementById('bg-opacity') as HTMLInputElement;
  const bgOverlay = document.getElementById('bg-overlay') as HTMLElement;

  bgUpload.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        bgOverlay.style.backgroundImage = `url(${event.target?.result})`;
      };
      reader.readAsDataURL(file);
    }
  });

  bgOpacity.addEventListener('input', (e) => {
    bgOverlay.style.opacity = (e.target as HTMLInputElement).value;
  });
}

// --- LOGIQUE DE TOURNOI ---
async function initTournamentGame() {
  try {
    const response = await fetch(`${API_BASE}/tournament/join?difficulty=40`);
    const data = await response.json();
    
    bucketId = data.bucketId;
    currentGrid = data.grid;
    solution = data.solution;
    seDifficulty = data.seDifficulty;
    referenceTime = data.referenceTime;

    document.getElementById('diff-display')!.textContent = `SE ${seDifficulty}`;
    renderGrid();
    startTimer();
  } catch (err) {
    console.error("Erreur Backend :", err);
    alert("Impossible de contacter le serveur de tournoi.");
  }
}

async function submitTournamentScore() {
  // Calcul du score (même formule que le backend pour l'affichage immédiat)
  const basePoints = Math.round(Math.pow(seDifficulty, 2) * 10);
  const finalScore = Math.round((basePoints * referenceTime) / Math.max(1, timer));
  
  document.getElementById('score-display')!.textContent = finalScore.toString();

  try {
    const response = await fetch(`${API_BASE}/tournament/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bucketId,
        playerName,
        score: finalScore,
        timeTaken: timer
      })
    });
    
    const data = await response.json();
    updateLeaderboardUI(data.leaderboard);
  } catch (err) {
    console.error("Échec de la soumission :", err);
  }
}

function updateLeaderboardUI(players: any[]) {
  const list = document.getElementById('leaderboard-list')!;
  list.innerHTML = players.map((p, index) => `
    <li>
      <span>${index + 1}. ${p.playerName}</span>
      <b>${p.score} pts</b>
    </li>
  `).join('');
}

// --- LOGIQUE DE JEU ---
function renderGrid() {
  const container = document.getElementById('grid-container')!;
  container.innerHTML = '';
  
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r.toString();
      cell.dataset.col = c.toString();
      
      const val = currentGrid[r][c];
      if (val !== 0) {
        cell.textContent = val.toString();
        cell.classList.add('fixed');
      }
      
      container.appendChild(cell);
    }
  }
}

function selectCell(r: number, c: number) {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => cell.classList.remove('selected'));
  
  const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
  if (cell && !cell.classList.contains('fixed')) {
    cell.classList.add('selected');
    selectedCell = { r, c };
  } else {
    selectedCell = null;
  }
}

function fillCell(r: number, c: number, val: number) {
  const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
  if (cell && !cell.classList.contains('fixed')) {
    currentGrid[r][c] = val;
    cell.textContent = val === 0 ? '' : val.toString();
    checkWin();
  }
}

function checkWin() {
  const isComplete = currentGrid.every((row, r) => row.every((val, c) => val === solution[r][c]));
  if (isComplete) {
    clearInterval(timerInterval);
    alert(`INCROYABLE ! ${playerName}, tu as terminé en ${formatTime(timer)}`);
    submitTournamentScore();
  }
}

// --- HELPERS ---
function startTimer() {
  timer = 0;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById('timer-display')!.textContent = formatTime(timer);
  }, 1000);
}

function formatTime(s: number) {
  const mins = Math.floor(s / 60).toString().padStart(2, '0');
  const secs = (s % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}
