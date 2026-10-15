// Each sort is a generator that sorts `arr` in place and yields a step every
// time it compares, swaps or writes a value. The visualizer replays those steps
// one at a time, so the algorithms don't need to know anything about React.
//
// Step shapes:
//   { type: 'compare', i, j }
//   { type: 'swap', i, j }
//   { type: 'set', i, value }   (used by merge sort, which copies instead of swapping)
//   { type: 'sorted', i }       (index i is in its final position)

function* swap(arr, i, j) {
  yield { type: 'swap', i, j };
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

export function* bubbleSort(arr) {
  const n = arr.length;
  for (let end = n - 1; end > 0; end--) {
    let swapped = false;
    for (let i = 0; i < end; i++) {
      yield { type: 'compare', i, j: i + 1 };
      if (arr[i] > arr[i + 1]) {
        yield* swap(arr, i, i + 1);
        swapped = true;
      }
    }
    yield { type: 'sorted', i: end };
    // no swaps on this pass means everything left is already in order
    if (!swapped) {
      for (let k = end - 1; k >= 0; k--) yield { type: 'sorted', i: k };
      return;
    }
  }
  if (n > 0) yield { type: 'sorted', i: 0 };
}

export function* insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0) {
      yield { type: 'compare', i: j - 1, j };
      if (arr[j - 1] <= arr[j]) break;
      yield* swap(arr, j - 1, j);
      j--;
    }
  }
  for (let k = 0; k < arr.length; k++) yield { type: 'sorted', i: k };
}

export function* selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', i: min, j };
      if (arr[j] < arr[min]) min = j;
    }
    if (min !== i) yield* swap(arr, i, min);
    yield { type: 'sorted', i };
  }
  if (n > 0) yield { type: 'sorted', i: n - 1 };
}

export function* mergeSort(arr) {
  yield* mergeSortRange(arr, 0, arr.length - 1);
  for (let k = 0; k < arr.length; k++) yield { type: 'sorted', i: k };
}

function* mergeSortRange(arr, lo, hi) {
  if (lo >= hi) return;
  const mid = Math.floor((lo + hi) / 2);
  yield* mergeSortRange(arr, lo, mid);
  yield* mergeSortRange(arr, mid + 1, hi);

  const left = arr.slice(lo, mid + 1);
  const right = arr.slice(mid + 1, hi + 1);
  let a = 0;
  let b = 0;
  let k = lo;

  while (a < left.length && b < right.length) {
    yield { type: 'compare', i: lo + a, j: mid + 1 + b };
    const value = left[a] <= right[b] ? left[a++] : right[b++];
    yield { type: 'set', i: k, value };
    arr[k++] = value;
  }
  while (a < left.length) {
    yield { type: 'set', i: k, value: left[a] };
    arr[k++] = left[a++];
  }
  while (b < right.length) {
    yield { type: 'set', i: k, value: right[b] };
    arr[k++] = right[b++];
  }
}

export function* quickSort(arr) {
  yield* quickSortRange(arr, 0, arr.length - 1);
}

function* quickSortRange(arr, lo, hi) {
  if (lo > hi) return;
  if (lo === hi) {
    yield { type: 'sorted', i: lo };
    return;
  }
  // Lomuto partition, using the last element as the pivot
  const pivot = arr[hi];
  let store = lo;
  for (let i = lo; i < hi; i++) {
    yield { type: 'compare', i, j: hi };
    if (arr[i] < pivot) {
      if (i !== store) yield* swap(arr, i, store);
      store++;
    }
  }
  if (store !== hi) yield* swap(arr, store, hi);
  yield { type: 'sorted', i: store };

  yield* quickSortRange(arr, lo, store - 1);
  yield* quickSortRange(arr, store + 1, hi);
}

export function* heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* siftDown(arr, i, n);
  }
  for (let end = n - 1; end > 0; end--) {
    yield* swap(arr, 0, end);
    yield { type: 'sorted', i: end };
    yield* siftDown(arr, 0, end);
  }
  if (n > 0) yield { type: 'sorted', i: 0 };
}

function* siftDown(arr, root, size) {
  while (true) {
    const left = 2 * root + 1;
    const right = left + 1;
    let largest = root;

    if (left < size) {
      yield { type: 'compare', i: left, j: largest };
      if (arr[left] > arr[largest]) largest = left;
    }
    if (right < size) {
      yield { type: 'compare', i: right, j: largest };
      if (arr[right] > arr[largest]) largest = right;
    }
    if (largest === root) return;

    yield* swap(arr, root, largest);
    root = largest;
  }
}
