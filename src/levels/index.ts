import * as L1 from './level1';
import * as L2 from './level2';
import * as L3 from './level3';
import * as L4 from './level4';
import * as L5 from './level5';
import * as L6 from './level6';
import * as L7 from './level7';
import * as L8 from './level8';
import * as L9 from './level9';
import * as L10 from './level10';
import * as L11 from './level11';
import * as L12 from './level12';
import * as L13 from './level13';
import * as L14 from './level14';
import * as L15 from './level15';
import * as L16 from './level16';
import * as L17 from './level17';
import * as L18 from './level18';
import * as L19 from './level19';
import * as L20 from './level20';


const LEVELS: Record<number, any> = {
  1: L1,
  2: L2,
  3: L3,
  4: L4,
  5: L5,
  6: L6,
  7: L7,
  8: L8,
  9: L9,
  10: L10,
  11: L11,
  12: L12,
  13: L13,
  14: L14,
  15: L15,
  16: L16,
  17: L17,
  18: L18,
  19: L19,
  20: L20,
};

export const LEVEL_KEYS = Object.keys(LEVELS).map(k => Number(k)).sort((a,b) => a - b);
export const MAX_LEVEL = LEVEL_KEYS.length;

export function getLevelModule(level: number) {
  return LEVELS[level] ?? LEVELS[1]; // fallback to level 1
}

export function getRandomLevel(): number {
  if (LEVEL_KEYS.length === 0) return 1;
  const idx = Math.floor(Math.random() * LEVEL_KEYS.length);
  return LEVEL_KEYS[idx];
}