export const END_THRESHOLD = 8; 
export const HAND_SIZE = 5;


export function splitAllocations(drawPile: any[], playerUids: string[]) {
  const allocations: Record<string, any[]> = {};
  for (const uid of playerUids) allocations[uid] = [];
  if (!Array.isArray(drawPile) || drawPile.length === 0) return allocations;

  if (playerUids.length === 2) {
    const half = Math.floor(drawPile.length / 2);
    allocations[playerUids[0]] = drawPile.slice(0, half);
    allocations[playerUids[1]] = drawPile.slice(half);
    return allocations;
  }

  let idx = 0;
  for (const t of drawPile) {
    const uid = playerUids[idx % playerUids.length];
    allocations[uid].push(t);
    idx++;
  }
  return allocations;
}


export function drawFromAllocation(allocations: Record<string, any[]>, uid: string, count: number) {
  const out: any[] = [];
  if (!allocations || !Array.isArray(allocations[uid]) || count <= 0) return out;
  while (out.length < count && allocations[uid].length > 0) {
    out.push(allocations[uid].shift()!);
  }
  return out;
}
