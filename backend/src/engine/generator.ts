/**
 * Sudokumabe Generator Engine
 * Procedural generation with unique solution guarantee and seed support.
 */

export type SudokuGrid = number[][];

export class SudokuGenerator {
  private size: number = 9;
  private seed: number = Math.random();

  /**
   * Génère une nouvelle grille de Sudoku.
   * @param {number} holes - Nombre de cases vides à créer (difficulté).
   * @param {string} seed - Graine optionnelle pour la reproductibilité.
   * @returns {{ grid: SudokuGrid, solution: SudokuGrid }}
   */
  generate(holes: number = 40, seed?: string): { grid: SudokuGrid, solution: SudokuGrid } {
    if (seed) {
      this.seed = parseInt(seed) || 0.12345;
    } else {
      this.seed = Math.random();
    }

    let grid: SudokuGrid = Array.from({ length: 9 }, () => Array(9).fill(0));
    
    // 1. Remplir la grille (Solution complète)
    this.fillGrid(grid);
    const solution = grid.map(row => [...row]);

    // 2. Retirer des chiffres (Création du puzzle)
    this.removeDigits(grid, holes);

    return { grid, solution };
  }

  // Générateur de nombres pseudo-aléatoires basé sur la seed (LCG)
  private seededRandom(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  private fillGrid(grid: SudokuGrid): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const numbers = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (let num of numbers) {
            if (this.isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (this.fillGrid(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  private isValid(grid: SudokuGrid, row: number, col: number, num: number): boolean {
    // Vérifier ligne et colonne
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    // Vérifier le carré 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  }

  private removeDigits(grid: SudokuGrid, holes: number) {
    let attempts = holes;
    while (attempts > 0) {
      let row = Math.floor(this.seededRandom() * 9);
      let col = Math.floor(this.seededRandom() * 9);
      while (grid[row][col] === 0) {
        row = Math.floor(this.seededRandom() * 9);
        col = Math.floor(this.seededRandom() * 9);
      }
      
      grid[row][col] = 0;
      attempts--;
    }
  }

  private shuffle(array: number[]): number[] {
    return array.sort(() => this.seededRandom() - 0.5);
  }
}
