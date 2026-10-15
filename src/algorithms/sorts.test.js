import { describe, expect, it } from 'vitest';
import { ALGORITHMS, applyStep, randomArray } from './index';

const cases = {
  empty: [],
  single: [7],
  two: [2, 1],
  sorted: [1, 2, 3, 4, 5, 6],
  reversed: [9, 8, 7, 6, 5, 4, 3, 2, 1],
  duplicates: [5, 1, 5, 3, 1, 3, 5],
  allSame: [4, 4, 4, 4],
};

// Replay the steps on a separate copy, the same way the UI does, so the test
// checks both the sort itself and that the steps it reports are correct.
function run(sort, input) {
  const working = input.slice();
  let bars = input.slice();
  const sorted = new Set();
  for (const step of sort(working)) {
    bars = applyStep(bars, step);
    if (step.type === 'sorted') sorted.add(step.i);
  }
  return { working, bars, sorted };
}

describe.each(Object.entries(ALGORITHMS))('%s', (_, { sort }) => {
  it.each(Object.entries(cases))('sorts %s input', (_, input) => {
    const expected = input.slice().sort((a, b) => a - b);
    const { working, bars } = run(sort, input);
    expect(working).toEqual(expected);
    expect(bars).toEqual(expected);
  });

  it('sorts 50 random arrays', () => {
    for (let t = 0; t < 50; t++) {
      const input = randomArray(1 + Math.floor(Math.random() * 60));
      const { bars } = run(sort, input);
      expect(bars).toEqual(input.slice().sort((a, b) => a - b));
    }
  });

  it('marks every index as sorted by the end', () => {
    const input = randomArray(25);
    const { sorted } = run(sort, input);
    expect(sorted.size).toBe(input.length);
  });
});

describe('applyStep', () => {
  it('does not mutate the original array', () => {
    const bars = [3, 1, 2];
    applyStep(bars, { type: 'swap', i: 0, j: 1 });
    applyStep(bars, { type: 'set', i: 2, value: 9 });
    expect(bars).toEqual([3, 1, 2]);
  });
});
