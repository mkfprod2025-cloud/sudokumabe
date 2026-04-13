/**
 * Engine Logic: Score and Elo Calculations (Pro Standards)
 * @author Gemini CLI (Expert Full-Stack & Game Designer)
 */
/**
 * Calcule le score final d'une partie (Points de Grille * Ratio Temps).
 */
export function calculateGameScore(basePoints, referenceTime, playerTime) {
    const timeTaken = Math.max(1, playerTime);
    let score = (basePoints * referenceTime) / timeTaken;
    return Math.round(Math.max(score, basePoints * 0.1));
}
/**
 * Met à jour le Elo selon la performance relative dans le bucket.
 * @param {number} playerElo - Elo actuel.
 * @param {number} avgBucketElo - Elo moyen du bucket de 50 joueurs.
 * @param {number} rank - Position finale (1 à 50).
 * @param {number} totalPlayers - Nombre de joueurs dans le bucket.
 * @returns {number} Nouveau Elo.
 */
export function updateElo(playerElo, avgBucketElo, rank, totalPlayers) {
    const K = 32; // Facteur de sensibilité standard
    // Score réel (S) : 1er = 1, Dernier = 0
    const actualScore = (totalPlayers - rank) / (totalPlayers - 1 || 1);
    // Score attendu (E)
    const expectedScore = 1 / (1 + Math.pow(10, (avgBucketElo - playerElo) / 400));
    const newElo = playerElo + K * (actualScore - expectedScore);
    // Limites Pro : 1000 min, 3000 max théorique
    return Math.round(Math.max(1000, newElo));
}
/**
 * Points de base basés sur la difficulté Sudoku Explainer (SE).
 */
export function getBasePoints(seDifficulty) {
    // Courbe exponentielle pour valoriser les grilles extrêmes (SE 9+)
    return Math.round(Math.pow(seDifficulty, 2.5) * 5);
}
