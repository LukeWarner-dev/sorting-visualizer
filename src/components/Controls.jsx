import { ALGORITHMS } from '../algorithms';

export default function Controls({
  algorithm,
  onAlgorithmChange,
  size,
  onSizeChange,
  speed,
  onSpeedChange,
  player,
}) {
  const running = player.status === 'running';

  return (
    <div className="controls">
      <label className="field">
        <span>Algorithm</span>
        <select value={algorithm} onChange={(e) => onAlgorithmChange(e.target.value)} disabled={running}>
          {Object.entries(ALGORITHMS).map(([key, { name }]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Size: {size}</span>
        <input
          type="range"
          min="5"
          max="150"
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          disabled={running}
        />
      </label>

      <label className="field">
        <span>Speed</span>
        <input
          type="range"
          min="1"
          max="100"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />
      </label>

      <div className="buttons">
        {running ? (
          <button className="primary" onClick={player.pause}>Pause</button>
        ) : (
          <button className="primary" onClick={player.play}>
            {player.status === 'paused' ? 'Resume' : player.status === 'done' ? 'Replay' : 'Sort'}
          </button>
        )}
        <button onClick={player.step} disabled={running || player.status === 'done'}>Step</button>
        <button onClick={player.replay} disabled={running || player.status === 'idle'}>Reset</button>
        <button onClick={() => player.shuffle(size)} disabled={running}>New array</button>
      </div>
    </div>
  );
}
