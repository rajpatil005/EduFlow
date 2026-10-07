interface DataPoint {
  label: string;
  value: number;
}

interface ResultChartProps {
  data: DataPoint[];
  height?: number;
  max?: number;
}

export const ResultChart = ({ data, height = 200, max = 100 }: ResultChartProps) => {
  const width = 500;
  const padding = 30;
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (d.value / max) * (height - padding * 2);
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id="resultGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 25, 50, 75, 100].map((tick) => {
        const y = height - padding - (tick / max) * (height - padding * 2);
        return (
          <g key={tick}>
            <line x1={padding} x2={width - padding} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
            <text x={padding - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400">
              {tick}
            </text>
          </g>
        );
      })}

      <path d={areaD} fill="url(#resultGradient)" />
      <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="#6366f1" strokeWidth="2.5" />
          <text x={p.x} y={height - 8} textAnchor="middle" className="text-[10px] fill-slate-500">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
};