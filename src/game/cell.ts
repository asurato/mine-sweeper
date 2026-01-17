export function getAdjacentCells(
  row: number,
  col: number,
  rows: number,
  cols: number
): [number, number][] {
  const adjacent: [number, number][] = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;

      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        adjacent.push([newRow, newCol]);
      }
    }
  }

  return adjacent;
}
