import { describe, it, expect } from 'vitest';
import { getAdjacentCells } from './cell';

describe('getAdjacentCells', () => {
  it('中央のセルは8つの隣接セルを返す', () => {
    const result = getAdjacentCells(1, 1, 3, 3);
    expect(result).toHaveLength(8);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([0, 2]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([1, 2]);
    expect(result).toContainEqual([2, 0]);
    expect(result).toContainEqual([2, 1]);
    expect(result).toContainEqual([2, 2]);
  });

  it('左上角のセルは3つの隣接セルを返す', () => {
    const result = getAdjacentCells(0, 0, 3, 3);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([1, 1]);
  });

  it('右下角のセルは3つの隣接セルを返す', () => {
    const result = getAdjacentCells(2, 2, 3, 3);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([1, 1]);
    expect(result).toContainEqual([1, 2]);
    expect(result).toContainEqual([2, 1]);
  });

  it('上辺のセルは5つの隣接セルを返す', () => {
    const result = getAdjacentCells(0, 1, 3, 3);
    expect(result).toHaveLength(5);
  });

  it('左辺のセルは5つの隣接セルを返す', () => {
    const result = getAdjacentCells(1, 0, 3, 3);
    expect(result).toHaveLength(5);
  });
});
