export default function InfoPanel({ info, stats, status }) {
  return (
    <aside className="info">
      <section>
        <h2>{info.name}</h2>
        <p>{info.description}</p>
        <table>
          <tbody>
            <tr><th>Best</th><td>{info.time.best}</td></tr>
            <tr><th>Average</th><td>{info.time.average}</td></tr>
            <tr><th>Worst</th><td>{info.time.worst}</td></tr>
            <tr><th>Space</th><td>{info.space}</td></tr>
            <tr><th>Stable</th><td>{info.stable ? 'Yes' : 'No'}</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>This run</h2>
        <dl className="stats">
          <div><dt>Comparisons</dt><dd>{stats.comparisons}</dd></div>
          <div><dt>Swaps</dt><dd>{stats.swaps}</dd></div>
          <div><dt>Writes</dt><dd>{stats.writes}</dd></div>
        </dl>
        {status === 'done' && <p className="done">Sorted.</p>}
      </section>

      <section className="legend">
        <span><i className="swatch comparing" /> Comparing</span>
        <span><i className="swatch swapping" /> Swapping / writing</span>
        <span><i className="swatch sorted" /> In final position</span>
      </section>
    </aside>
  );
}
