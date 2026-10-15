import {
  bubbleSort,
  heapSort,
  insertionSort,
  mergeSort,
  quickSort,
  selectionSort,
} from './sorts';

export const ALGORITHMS = {
  bubble: {
    name: 'Bubble sort',
    sort: bubbleSort,
    time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    space: 'O(1)',
    stable: true,
    description:
      'Walks through the array swapping neighbours that are out of order. After each pass the largest remaining value has "bubbled" to the end. Stops early if a pass makes no swaps.',
  },
  insertion: {
    name: 'Insertion sort',
    sort: insertionSort,
    time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    space: 'O(1)',
    stable: true,
    description:
      'Builds a sorted section on the left one value at a time, sliding each new value back until it is in place. Very fast on arrays that are already nearly sorted.',
  },
  selection: {
    name: 'Selection sort',
    sort: selectionSort,
    time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    space: 'O(1)',
    stable: false,
    description:
      'Finds the smallest value in the unsorted section and swaps it to the front. Always does the same number of comparisons, but very few swaps.',
  },
  merge: {
    name: 'Merge sort',
    sort: mergeSort,
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    space: 'O(n)',
    stable: true,
    description:
      'Splits the array in half until each piece has one value, then merges the pieces back together in order. Predictable, but needs extra memory for the merge.',
  },
  quick: {
    name: 'Quick sort',
    sort: quickSort,
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    space: 'O(log n)',
    stable: false,
    description:
      'Picks a pivot (here the last value), moves everything smaller to its left, then sorts each side. Usually the fastest in practice, but slows down on already sorted input.',
  },
  heap: {
    name: 'Heap sort',
    sort: heapSort,
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    space: 'O(1)',
    stable: false,
    description:
      'Arranges the array into a max-heap, then repeatedly swaps the largest value to the end and repairs the heap. Guaranteed O(n log n) without extra memory.',
  },
};

// Applies one step to a bar array and returns a new array (doesn't mutate).
export function applyStep(bars, step) {
  if (step.type === 'swap') {
    const next = bars.slice();
    [next[step.i], next[step.j]] = [next[step.j], next[step.i]];
    return next;
  }
  if (step.type === 'set') {
    const next = bars.slice();
    next[step.i] = step.value;
    return next;
  }
  return bars;
}

export function randomArray(size, min = 5, max = 100) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}
