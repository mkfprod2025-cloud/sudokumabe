/**
 * Sudokumabe Generator Engine
 * Procedural generation with unique solution guarantee and seed support.
 */
export type SudokuGrid = number[][];
export declare class SudokuGenerator {
    private size;
    private seed;
    /**
     * Génère une nouvelle grille de Sudoku.
     * @param {number} holes - Nombre de cases vides à créer (difficulté).
     * @param {string} seed - Graine optionnelle pour la reproductibilité.
     * @returns {{ grid: SudokuGrid, solution: SudokuGrid }}
     */
    generate(holes?: number, seed?: string): {
        grid: SudokuGrid;
        solution: SudokuGrid;
    };
    private seededRandom;
    private fillGrid;
    private isValid;
    private removeDigits;
    private shuffle;
}
//# sourceMappingURL=generator.d.ts.map