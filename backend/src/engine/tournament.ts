/**
 * Sudokumabe Tournament Manager
 * Handles asynchronous buckets of 50 players and leaderboard.
 */

import * as logic from './logic';

export interface PlayerProfile {
  name: string;
  elo: number;
  totalGames: number;
}

export interface ScoreEntry {
  playerName: string;
  score: number;
  timeTaken: number;
  timestamp: number;
  eloAtCompletion?: number;
}

export interface Bucket {
  id: string;
  seed: string;
  difficulty: number;
  players: ScoreEntry[];
  isFull: boolean;
  averageElo: number;
}

export class TournamentManager {
  private buckets: Map<string, Bucket> = new Map();
  private players: Map<string, PlayerProfile> = new Map();
  private readonly MAX_PLAYERS_PER_BUCKET = 50;

  /**
   * Récupère ou crée un profil joueur.
   */
  getPlayerProfile(name: string): PlayerProfile {
    if (!this.players.has(name)) {
      this.players.set(name, { name, elo: 1000, totalGames: 0 });
    }
    return this.players.get(name)!;
  }

  /**
   * Récupère ou crée un bucket.
   */
  getAvailableBucket(difficulty: number): Bucket {
    for (let bucket of this.buckets.values()) {
      if (bucket.difficulty === difficulty && !bucket.isFull) {
        return bucket;
      }
    }

    const newId = `tournament_${Date.now()}`;
    const newBucket: Bucket = {
      id: newId,
      seed: (Date.now() % 1000000).toString(),
      difficulty,
      players: [],
      isFull: false,
      averageElo: 1200 // Elo moyen par défaut pour le calcul initial
    };
    this.buckets.set(newId, newBucket);
    return newBucket;
  }

  /**
   * Enregistre un score et recalcule le Elo du joueur.
   */
  submitScore(bucketId: string, playerName: string, score: number, timeTaken: number): { bucket: Bucket, player: PlayerProfile } | null {
    const bucket = this.buckets.get(bucketId);
    if (!bucket) return null;

    const profile = this.getPlayerProfile(playerName);
    
    const entry: ScoreEntry = {
      playerName,
      score,
      timeTaken,
      timestamp: Date.now(),
      eloAtCompletion: profile.elo
    };

    bucket.players.push(entry);
    bucket.players.sort((a, b) => b.score - a.score);

    // Calcul de la position (Rank)
    const rank = bucket.players.findIndex(p => p.playerName === playerName) + 1;

    // Mise à jour du Elo Pro
    profile.elo = logic.updateElo(profile.elo, bucket.averageElo, rank, bucket.players.length);
    profile.totalGames++;

    // Mise à jour de l'Elo moyen du bucket pour les prochains joueurs
    const totalElo = bucket.players.reduce((sum, p) => sum + (p.eloAtCompletion || 1000), 0);
    bucket.averageElo = Math.round(totalElo / bucket.players.length);

    if (bucket.players.length >= this.MAX_PLAYERS_PER_BUCKET) {
      bucket.isFull = true;
    }

    return { bucket, player: profile };
  }
}
