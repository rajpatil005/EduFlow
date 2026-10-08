interface Segment {
  label: string;
  value: number;
  color: string;
}

interface AttendanceChartProps {
  data: Segment[];
  size?: number;
}

export const AttendanceChart = ({ data, size = 180 }: AttendanceChartProps) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let offset = 0;

  return (
    <div className="flex items-center gap-8">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 42 42">
          <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#f1f5f9" strokeWidth="5" />
          {data.map((d, i) => {
            const percent = (d.value / total) * 100;
            const circle = (
              <circle
                key={i}
                cx="21"
                cy="21"
                r="15.9155"
                fill="transparent"
                stroke={d.color}
                strokeWidth="5"
                strokeDasharray={`${percent} ${100 - percent}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            );
            offset += percent;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{total}</span>
          <span className="text-xs text-slate-500">Total</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ background: d.color }} />
            <span className="text-sm text-slate-700 flex-1">{d.label}</span>
            <span className="text-sm font-semibold text-slate-900">{d.value}</span>
            <span className="text-xs text-slate-500 w-12 text-right">
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};