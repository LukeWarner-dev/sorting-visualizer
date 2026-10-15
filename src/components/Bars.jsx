const MAX_VALUE = 100;

export default function Bars({ bars, comparing, swapping, sorted }) {
  const showValues = bars.length <= 30;

  return (
    <div className="bars" role="img" aria-label={`Array of ${bars.length} values`}>
      {bars.map((value, index) => {
        let state = '';
        if (swapping?.includes(index)) state = 'swapping';
        else if (comparing?.includes(index)) state = 'comparing';
        else if (sorted.has(index)) state = 'sorted';

        return (
          <div
            key={index}
            className={`bar ${state}`}
            style={{ height: `${(value / MAX_VALUE) * 100}%` }}
          >
            {showValues && <span className="bar-value">{value}</span>}
          </div>
        );
      })}
    </div>
  );
}
