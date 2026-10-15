import { useCallback, useEffect, useReducer, useRef } from 'react';
import { ALGORITHMS, applyStep, randomArray } from '../algorithms';

function freshState(bars) {
  return {
    bars,
    comparing: null,
    swapping: null,
    sorted: new Set(),
    stats: { comparisons: 0, swaps: 0, writes: 0 },
    status: 'idle', // idle | running | paused | done
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'reset':
      return freshState(action.bars);

    case 'status':
      return { ...state, status: action.status };

    case 'steps': {
      let { bars, comparing, swapping } = state;
      const sorted = new Set(state.sorted);
      const stats = { ...state.stats };

      for (const step of action.steps) {
        bars = applyStep(bars, step);
        if (step.type === 'compare') {
          comparing = [step.i, step.j];
          swapping = null;
          stats.comparisons++;
        } else if (step.type === 'swap') {
          swapping = [step.i, step.j];
          stats.swaps++;
        } else if (step.type === 'set') {
          swapping = [step.i];
          stats.writes++;
        } else if (step.type === 'sorted') {
          sorted.add(step.i);
        }
      }
      return { ...state, bars, comparing, swapping, sorted, stats };
    }

    case 'done':
      return { ...state, status: 'done', comparing: null, swapping: null };

    default:
      return state;
  }
}

// Turns the 1-100 speed slider into a delay between ticks and a number of
// steps to play per tick. setTimeout can't reliably go much below ~4ms, so at
// the top of the slider we play several steps per tick instead.
export function timing(speed) {
  const delay = Math.round(400 * Math.pow(1 - speed / 100, 2));
  const stepsPerTick = delay < 4 ? Math.ceil(speed / 10) : 1;
  return { delay, stepsPerTick };
}

export function useSortPlayer({ algorithm, initialSize, speed }) {
  const [state, dispatch] = useReducer(reducer, initialSize, (n) => freshState(randomArray(n)));

  // the unsorted numbers, so "replay" and switching algorithm can reuse them
  const original = useRef(state.bars);
  const generator = useRef(null);
  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const load = useCallback((bars) => {
    original.current = bars;
    generator.current = null;
    dispatch({ type: 'reset', bars });
  }, []);

  const pull = useCallback((count) => {
    if (!generator.current) {
      generator.current = ALGORITHMS[algorithm].sort(state.bars.slice());
    }
    const steps = [];
    for (let k = 0; k < count; k++) {
      const { value, done } = generator.current.next();
      if (done) {
        if (steps.length) dispatch({ type: 'steps', steps });
        dispatch({ type: 'done' });
        generator.current = null;
        return;
      }
      steps.push(value);
    }
    dispatch({ type: 'steps', steps });
  }, [algorithm, state.bars]);

  // play loop: every time state changes while running, schedule the next tick
  useEffect(() => {
    if (state.status !== 'running') return;
    const { delay, stepsPerTick } = timing(speedRef.current);
    const id = setTimeout(() => pull(stepsPerTick), delay);
    return () => clearTimeout(id);
  }, [state.status, state.stats, state.sorted, pull]);

  function play() {
    // sorting an already sorted array isn't interesting, so start over
    if (state.status === 'done') load(original.current);
    dispatch({ type: 'status', status: 'running' });
  }

  function pause() {
    dispatch({ type: 'status', status: 'paused' });
  }

  function step() {
    if (state.status === 'done' || state.status === 'running') return;
    dispatch({ type: 'status', status: 'paused' });
    pull(1);
  }

  return {
    ...state,
    play,
    pause,
    step,
    shuffle: (size) => load(randomArray(size)),
    replay: () => load(original.current),
  };
}
