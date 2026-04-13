/**
 * Sudokumabe Tournament Manager
 * Handles asynchronous buckets of 50 players and leaderboard.
 */
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
export declare class TournamentManager {
    private buckets;
    private players;
    private readonly MAX_PLAYERS_PER_BUCKET;
    /**
     * Récupère ou crée un profil joueur.
     */
    getPlayerProfile(name: string): PlayerProfile;
    /**
     * Récupère ou crée un bucket.
     */
    getAvailableBucket(difficulty: number): Bucket;
    /**
     * Enregistre un score et recalcule le Elo du joueur.
     */
    submitScore(bucketId: string, playerName: string, score: number, timeTaken: number): {
        bucket: Bucket;
        player: PlayerProfile;
    } | null;
}
//# sourceMappingURL=tournament.d.ts.map