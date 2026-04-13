"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const logic = __importStar(require("./engine/logic"));
const generator_1 = require("./engine/generator");
const tournament_1 = require("./engine/tournament");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const generator = new generator_1.SudokuGenerator();
const tournament = new tournament_1.TournamentManager();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// --- ROUTES TOURNOIS ---
/**
 * Rejoindre un tournoi (Bucket)
 */
app.get('/api/tournament/join', (req, res) => {
    const difficulty = req.query.difficulty ? parseInt(req.query.difficulty) : 40;
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
app.post('/api/tournament/submit', (req, res) => {
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
app.get('/api/player/:name', (req, res) => {
    const profile = tournament.getPlayerProfile(req.params.name);
    res.json(profile);
});
// --- ROUTES STANDALONE ---
app.get('/api/status', (req, res) => {
    res.json({ status: 'online', engine: 'Sudoku-Infinium-V1' });
});
app.get('/api/puzzle/generate', (req, res) => {
    const difficulty = req.query.difficulty ? parseInt(req.query.difficulty) : 40;
    const { grid, solution } = generator.generate(difficulty);
    const seDifficulty = (difficulty / 10).toFixed(1);
    res.json({ grid, solution, seDifficulty: parseFloat(seDifficulty), referenceTime: difficulty * 5 });
});
app.listen(PORT, () => {
    console.log(`Serveur Sudokumabe démarré sur le port ${PORT}`);
});
//# sourceMappingURL=server.js.map