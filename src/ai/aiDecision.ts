import { GridCell, DeckItem, LogicProps } from '../types';
import { buildSmartDeck } from '../hooks/logic';

export function computeAiMove(
  props: Partial<LogicProps> & {
    letterDeck?: DeckItem[];
    solutionGrid?: string[][];
    allAvailableLetters?: string[];
  },
  moves: number = 1,
  forbiddenChars?: Record<string, number>,
) {
  const grid = props.grid ?? [];
  const solution = props.solutionGrid ?? [];
  const allAvailable = Array.isArray(props.allAvailableLetters)
    ? props.allAvailableLetters
    : [];
  const letterDeck = Array.isArray(props.letterDeck)
    ? [...props.letterDeck]
    : [];

  if (letterDeck.length < moves || letterDeck.length === 0) {
    try {
      const fallbackTarget = Math.max(1, Math.min(5, moves || 5));
      const fallback = buildSmartDeck(
        [],
        [],
        grid,
        solution,
        allAvailable,
        fallbackTarget,
      );
      if (Array.isArray(fallback) && fallback.length > 0) {
        if (forbiddenChars && Object.keys(forbiddenChars).length > 0) {
          const nonForbidden = fallback.filter(
            d =>
              !(forbiddenChars[(d?.char ?? '').toString().toUpperCase()] > 0),
          );
          const chosen =
            nonForbidden.length >= fallbackTarget
              ? nonForbidden.slice(0, fallbackTarget)
              : fallback.slice(0, fallbackTarget);
          letterDeck.splice(0, letterDeck.length, ...chosen);
        } else {
          letterDeck.splice(
            0,
            letterDeck.length,
            ...fallback.slice(0, fallbackTarget),
          );
        }
        console.log(
          '[computeAiMove] fallback built aiDeck:',
          letterDeck.map(d => d.char),
        );
      }
    } catch (e) {
      console.warn('computeAiMove: fallback buildSmartDeck failed', e);
    }
  }

  const getNeededCounts = (g: GridCell[][], sol: string[][]) => {
    const needed: Record<string, number> = {};
    for (let r = 0; r < g.length; r++) {
      for (let c = 0; c < (g[r]?.length ?? 0); c++) {
        const expected = (sol[r]?.[c] ?? '').toUpperCase();
        const cell = g[r]?.[c];
        if (expected && cell && cell.type === 'empty' && !cell.text) {
          needed[expected] = (needed[expected] || 0) + 1;
        }
      }
    }
    return needed;
  };

  const emptyCells: { r: number; c: number; expected: string }[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < (grid[r]?.length ?? 0); c++) {
      const cell = grid[r][c];
      if (cell && cell.type === 'empty' && !cell.text) {
        const expected = (solution[r]?.[c] ?? '').toUpperCase();
        emptyCells.push({ r, c, expected });
      }
    }
  }

  if (emptyCells.length === 0) {
    return {
      placements: [] as {
        r: number;
        c: number;
        placed: string;
        correct: boolean;
      }[],
      newGrid: grid.map(r => r.map(c => ({ ...c }))),
      newDeck: letterDeck,
      scoreDelta: 0,
      letters: [] as string[],
    };
  }

  const neededCounts = getNeededCounts(grid, solution);
  const deckCopy = [...letterDeck];

  try {
    if (forbiddenChars && Object.keys(forbiddenChars).length > 0) {
      const beforeLen = deckCopy.length;
      for (let i = deckCopy.length - 1; i >= 0; i--) {
        const ch = ((deckCopy[i]?.char ?? '') + '').toString().toUpperCase();
        if (forbiddenChars[ch] && forbiddenChars[ch] > 0) {
          // remove this tile from deckCopy (AI shouldn't be able to use player's tiles)
          deckCopy.splice(i, 1);
        }
      }
      if (deckCopy.length !== beforeLen) {
        console.log(
          '[computeAiMove] sanitized deckCopy to remove forbidden letters ->',
          deckCopy.map(d => d.char),
        );
      }
    }
  } catch (e) {
    console.warn('[computeAiMove] deckCopy sanitation failed', e);
  }

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
  const newGrid: GridCell[][] = grid.map((row: GridCell[]) =>
    row.map((cell: GridCell) => ({ ...cell })),
  );
  let scoreDelta = 0;
  const placements: {
    r: number;
    c: number;
    placed: string;
    correct: boolean;
  }[] = [];
  const letters: string[] = [];

  const aiAccuracy = 0.95;

  const pickAvoidForbidden = (arr: string[]) => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    // try to pick an item that is NOT forbidden first
    const nonForbidden = arr.filter(
      ch => !forbiddenChars || !(forbiddenChars[(ch ?? '').toUpperCase()] > 0),
    );
    if (nonForbidden.length > 0)
      return nonForbidden[Math.floor(Math.random() * nonForbidden.length)];
    // if all are forbidden, return any (last resort)
    return arr[Math.floor(Math.random() * arr.length)];
  };

  for (let i = 0; i < movesToDo; i++) {
    if (deckCopy.length === 0) break;
    const poolIdxPreferNonForbiddenExpected = pool.findIndex(e => {
      const exp = (e.expected ?? '').toUpperCase();
      if (!exp) return false;
      return deckCopy.some(d => {
        const ch = (d.char ?? '').toString().toUpperCase();
        const isForbidden = !!(
          forbiddenChars &&
          forbiddenChars[ch] &&
          forbiddenChars[ch] > 0
        );
        return ch === exp && !isForbidden;
      });
    });

    const poolIdxExpectedAny = pool.findIndex(e => {
      const exp = (e.expected ?? '').toUpperCase();
      if (!exp) return false;
      return deckCopy.some(
        d => (d.char ?? '').toString().toUpperCase() === exp,
      );
    });

    const poolIdxWithNeededNonForbidden = pool.findIndex(e => {
      return deckCopy.some(d => {
        const ch = (d.char ?? '').toString().toUpperCase();
        const isForbidden = !!(
          forbiddenChars &&
          forbiddenChars[ch] &&
          forbiddenChars[ch] > 0
        );
        return !!neededCounts[ch] && !isForbidden;
      });
    });

    const poolIdxWithNeededAny = pool.findIndex(e => {
      return deckCopy.some(d => {
        const ch = (d.char ?? '').toString().toUpperCase();
        return !!neededCounts[ch];
      });
    });

    let chosenIndex =
      poolIdxPreferNonForbiddenExpected !== -1
        ? poolIdxPreferNonForbiddenExpected
        : poolIdxExpectedAny !== -1
        ? poolIdxExpectedAny
        : poolIdxWithNeededNonForbidden !== -1
        ? poolIdxWithNeededNonForbidden
        : poolIdxWithNeededAny !== -1
        ? poolIdxWithNeededAny
        : pool.length > 0
        ? Math.floor(Math.random() * pool.length)
        : -1;

    if (chosenIndex === -1) break;
    const chosen = pool.splice(chosenIndex, 1)[0];

    const expectedUpper = (chosen.expected ?? '').toUpperCase();
    let letterToPlace = '';

    let deckIdx = deckCopy.findIndex(d => {
      const ch = (d.char ?? '').toString().toUpperCase();
      const isForbidden = !!(
        forbiddenChars &&
        forbiddenChars[ch] &&
        forbiddenChars[ch] > 0
      );
      return ch === expectedUpper && !isForbidden;
    });
    if (expectedUpper && deckIdx !== -1) {
      letterToPlace = expectedUpper;
      deckCopy.splice(deckIdx, 1);
    } else {
      deckIdx = deckCopy.findIndex(
        d => (d.char ?? '').toString().toUpperCase() === expectedUpper,
      );
      if (expectedUpper && deckIdx !== -1) {
        letterToPlace = expectedUpper;
        deckCopy.splice(deckIdx, 1);
      } else {
        deckIdx = deckCopy.findIndex(d => {
          const ch = (d.char ?? '').toString().toUpperCase();
          const isForbidden = !!(
            forbiddenChars &&
            forbiddenChars[ch] &&
            forbiddenChars[ch] > 0
          );
          return !!neededCounts[ch] && !isForbidden;
        });
        if (deckIdx !== -1) {
          letterToPlace = (deckCopy[deckIdx].char ?? '')
            .toString()
            .toUpperCase();
          deckCopy.splice(deckIdx, 1);
        } else {
          deckIdx = deckCopy.findIndex(d => {
            const ch = (d.char ?? '').toString().toUpperCase();
            return !(
              forbiddenChars &&
              forbiddenChars[ch] &&
              forbiddenChars[ch] > 0
            );
          });
          if (deckIdx !== -1) {
            letterToPlace = (deckCopy[deckIdx].char ?? '')
              .toString()
              .toUpperCase();
            deckCopy.splice(deckIdx, 1);
          } else {
            const pickIdx = Math.floor(Math.random() * deckCopy.length);
            letterToPlace = (deckCopy[pickIdx].char ?? '')
              .toString()
              .toUpperCase();
            deckCopy.splice(pickIdx, 1);
          }
        }
      }
    }

    const lU = letterToPlace.toUpperCase();
    if (forbiddenChars && forbiddenChars[lU] && forbiddenChars[lU] > 0) {
      forbiddenChars[lU] = Math.max(0, forbiddenChars[lU] - 1);
    }

    const r = chosen.r;
    const c = chosen.c;
    const correctLetter = (solution[r]?.[c] ?? '').toUpperCase();
    const isCorrect = !!correctLetter && letterToPlace === correctLetter;

    if (isCorrect) {
      newGrid[r][c] = {
        ...newGrid[r][c],
        text: letterToPlace,
        type: 'letter',
        placed: true,
        placedBy: 'Opponent',
        tentative: false,
        tentativeBy: undefined,
        tentativeTileId: undefined,
      };
      scoreDelta += 1;
    } else {
      newGrid[r][c] = {
        ...newGrid[r][c],
        text: '',
        type: 'empty',
        placed: false,
        placedBy: undefined,
        tentative: false,
        tentativeBy: undefined,
        tentativeTileId: undefined,
      };
    }

    placements.push({ r, c, placed: letterToPlace, correct: isCorrect });
    letters.push(letterToPlace);

    if (chosen.expected && neededCounts[chosen.expected]) {
      neededCounts[chosen.expected] = Math.max(
        0,
        neededCounts[chosen.expected] - 1,
      );
    }
  }

  const newDeck = buildSmartDeck(
    deckCopy,
    [],
    newGrid,
    solution,
    allAvailable,
    5,
  );

  return {
    placements,
    newGrid,
    newDeck,
    scoreDelta,
    letters,
  };
}
