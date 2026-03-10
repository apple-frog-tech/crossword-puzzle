import { GridCell } from '../types';
export type AiPlacement = {
  r: number;
  c: number;
  char: string;
  correct: boolean;
};

function getNeededCounts(
  grid: GridCell[][],
  solutionGrid: string[][],
): Record<string, number> {
  const needed: Record<string, number> = {};
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < (grid[r]?.length ?? 0); c++) {
      const expected = (solutionGrid[r]?.[c] ?? '').toUpperCase();
      const cell = grid[r]?.[c];
      if (expected && cell && cell.type === 'empty' && !cell.text) {
        needed[expected] = (needed[expected] || 0) + 1;
      }
    }
  }
  return needed;
}

function computeSolutionPool(solutionGrid: string[][]): string[] {
  const flat = solutionGrid
    .flat()
    .filter(Boolean)
    .map(s => (s ?? '').toUpperCase());
  return Array.from(new Set(flat));
}

export function aiSelectMoves(params: {
  grid: GridCell[][];
  solutionGrid: string[][];
  moves?: number;
  accuracy?: number;
  allAvailableLetters?: string[];
}): AiPlacement[] {
  const {
    grid,
    solutionGrid,
    moves = 1,
    accuracy = 0.95,
    allAvailableLetters = [],
  } = params;
  if (!grid || !solutionGrid) return [];

  const emptyCells: { r: number; c: number; expected: string }[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < (grid[r]?.length ?? 0); c++) {
      const cell = grid[r][c];
      if (cell && cell.type === 'empty' && !cell.text) {
        const expected = (solutionGrid[r]?.[c] ?? '').toUpperCase();
        emptyCells.push({ r, c, expected });
      }
    }
  }
  if (emptyCells.length === 0) return [];

  const neededCounts = getNeededCounts(grid, solutionGrid);

  const withExpected = emptyCells.filter(
    e => e.expected && e.expected.length > 0,
  );
  const candidatesExpected = withExpected.filter(
    e => (neededCounts[e.expected] ?? 0) > 0,
  );

  const pool: { r: number; c: number; expected: string }[] = [];
  if (candidatesExpected.length > 0) pool.push(...candidatesExpected);
  const remainingWithExpected = withExpected.filter(
    e => !candidatesExpected.includes(e),
  );
  if (remainingWithExpected.length > 0) pool.push(...remainingWithExpected);
  const others = emptyCells.filter(e => !pool.includes(e));
  if (others.length > 0) pool.push(...others);

  const movesToDo = Math.min(moves, pool.length);
  const placements: AiPlacement[] = [];

  for (let i = 0; i < movesToDo; i++) {
    const pickIndex = Math.floor(Math.random() * (pool.length - i));
    const chosen = pool.splice(pickIndex, 1)[0];

    let letterToPlace = '';
    if (chosen.expected && Math.random() < accuracy) {
      letterToPlace = chosen.expected;
    } else {
      const weighted: string[] = [];
      Object.entries(neededCounts).forEach(([ch, cnt]) => {
        for (let k = 0; k < cnt; k++) weighted.push(ch);
      });
      if (weighted.length > 0) {
        letterToPlace = weighted[Math.floor(Math.random() * weighted.length)];
      } else {
        const solPool = computeSolutionPool(solutionGrid);
        const fallbackPool =
          solPool.length > 0
            ? solPool
            : Array.from(
                new Set(
                  allAvailableLetters.map(s =>
                    (s ?? '').toString().toUpperCase(),
                  ),
                ),
              );
        if (fallbackPool.length === 0) break;
        letterToPlace =
          fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
      }
    }

    const r = chosen.r;
    const c = chosen.c;
    const expected = (solutionGrid[r]?.[c] ?? '').toUpperCase();
    const isCorrect = !!(
      expected && letterToPlace.toUpperCase() === expected.toUpperCase()
    );

    if (chosen.expected && neededCounts[chosen.expected]) {
      neededCounts[chosen.expected] = Math.max(
        0,
        neededCounts[chosen.expected] - 1,
      );
    }

    placements.push({ r, c, char: letterToPlace, correct: isCorrect });
  }

  return placements;
}
