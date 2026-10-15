import { useState } from 'react';
import { ALGORITHMS } from './algorithms';
import { useSortPlayer } from './hooks/useSortPlayer';
import Bars from './components/Bars';
import Controls from './components/Controls';
import InfoPanel from './components/InfoPanel';

const DEFAULT_SIZE = 40;

export default function App() {
  const [algorithm, setAlgorithm] = useState('merge');
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(60);

  const player = useSortPlayer({ algorithm, initialSize: DEFAULT_SIZE, speed });

  function changeAlgorithm(key) {
    setAlgorithm(key);
    player.replay(); // same numbers, so the two runs can be compared
  }

  function changeSize(newSize) {
    setSize(newSize);
    player.shuffle(newSize);
  }

  return (
    <div className="app">
      <header>
        <h1>Sorting Visualizer</h1>
        <p>Pick an algorithm and watch how it sorts the array, one comparison at a time.</p>
      </header>

      <Controls
        algorithm={algorithm}
        onAlgorithmChange={changeAlgorithm}
        size={size}
        onSizeChange={changeSize}
        speed={speed}
        onSpeedChange={setSpeed}
        player={player}
      />

      <main>
        <Bars
          bars={player.bars}
          comparing={player.comparing}
          swapping={player.swapping}
          sorted={player.sorted}
        />
        <InfoPanel info={ALGORITHMS[algorithm]} stats={player.stats} status={player.status} />
      </main>
    </div>
  );
}
