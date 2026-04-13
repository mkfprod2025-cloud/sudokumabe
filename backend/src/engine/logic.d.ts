/**
 * Engine Logic: Score and Elo Calculations (Pro Standards)
 * @author Gemini CLI (Expert Full-Stack & Game Designer)
 */
/**
 * Calcule le score final d'une partie (Points de Grille * Ratio Temps).
 */
export declare function calculateGameScore(basePoints: number, referenceTime: number, playerTime: number): number;
/**
 * Met à jour le Elo selon la performance relative dans le bucket.
 * @param {number} playerElo - Elo actuel.
 * @param {number} avgBucketElo - Elo moyen du bucket de 50 joueurs.
 * @param {number} rank - Position finale (1 à 50).
 * @param {number} totalPlayers - Nombre de joueurs dans le bucket.
 * @returns {number} Nouveau Elo.
 */
export declare function updateElo(playerElo: number, avgBucketElo: number, rank: number, totalPlayers: number): number;
/**
 * Points de base basés sur la difficulté Sudoku Explainer (SE).
 */
export declare function getBasePoints(seDifficulty: number): number;
//# sourceMappingURL=logic.d.ts.map