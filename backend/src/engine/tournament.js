"use strict";
/**
 * Sudokumabe Tournament Manager
 * Handles asynchronous buckets of 50 players and leaderboard.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentManager = void 0;
const logic = __importStar(require("./logic"));
class TournamentManager {
    buckets = new Map();
    players = new Map();
    MAX_PLAYERS_PER_BUCKET = 50;
    /**
     * Récupère ou crée un profil joueur.
     */
    getPlayerProfile(name) {
        if (!this.players.has(name)) {
            this.players.set(name, { name, elo: 1000, totalGames: 0 });
        }
        return this.players.get(name);
    }
    /**
     * Récupère ou crée un bucket.
     */
    getAvailableBucket(difficulty) {
        for (let bucket of this.buckets.values()) {
            if (bucket.difficulty === difficulty && !bucket.isFull) {
                return bucket;
            }
        }
        const newId = `tournament_${Date.now()}`;
        const newBucket = {
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
    submitScore(bucketId, playerName, score, timeTaken) {
        const bucket = this.buckets.get(bucketId);
        if (!bucket)
            return null;
        const profile = this.getPlayerProfile(playerName);
        const entry = {
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
exports.TournamentManager = TournamentManager;
//# sourceMappingURL=tournament.js.map