import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as logic from './engine/logic';
import { SudokuGenerator } from './engine/generator';
import { TournamentManager } from './engine/tournament';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const generator = new SudokuGenerator();
const tournament = new TournamentManager();

app.use(cors());
app.use(express.json());

// --- ROUTES TOURNOIS ---

/**
 * Rejoindre un tournoi (Bucket)
 */
app.get('/api/tournament/join', (req: Request, res: Response) => {
  const difficulty = req.query.difficulty ? parseInt(req.query.difficulty as string) : 40;
  const bucket = tournament.getAvailableBucket(difficulty);
  const { grid, solution } = generator.generate(difficulty, bucket.seed);
  
  const seDifficulty = (difficulty / 10).toFixed(1);

  res.json({ 
    bucketId: bucket.id,
    grid, 
    solution,
    seDifficulty: parseFloat(seDifficulty),
    referenceTime: difficulty * 5
  });
});

/**
 * Soumettre un score à un bucket et mettre à jour le Elo
 */
app.post('/api/tournament/submit', (req: Request, res: Response) => {
  const { bucketId, playerName, score, timeTaken } = req.body;
  
  const result = tournament.submitScore(bucketId, playerName, score, timeTaken);
  
  if (!result) {
    return res.status(404).json({ error: 'Bucket non trouvé' });
  }

  res.json({ 
    message: 'Score enregistré',
    player: result.player,
    leaderboard: result.bucket.players 
  });
});

/**
 * Récupérer le profil d'un joueur
 */
app.get('/api/player/:name', (req: Request, res: Response) => {
  const profile = tournament.getPlayerProfile(req.params.name);
  res.json(profile);
});

// --- ROUTES STANDALONE ---

app.get('/api/status', (req: Request, res: Response) => {
  res.json({ status: 'online', engine: 'Sudoku-Infinium-V1' });
});

app.get('/api/puzzle/generate', (req: Request, res: Response) => {
  const difficulty = req.query.difficulty ? parseInt(req.query.difficulty as string) : 40;
  const { grid, solution } = generator.generate(difficulty);
  const seDifficulty = (difficulty / 10).toFixed(1);
  res.json({ grid, solution, seDifficulty: parseFloat(seDifficulty), referenceTime: difficulty * 5 });
});

app.listen(PORT, () => {
  console.log(`Serveur Sudokumabe démarré sur le port ${PORT}`);
});
