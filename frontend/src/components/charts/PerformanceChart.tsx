interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface PerformanceChartProps {
  data: DataPoint[];
  height?: number;
  title?: string;
}

export const PerformanceChart = ({ data, height = 240, title }: PerformanceChartProps) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      {title && <h4 className="text-sm font-semibold text-slate-700 mb-4">{title}</h4>}
      <div style={{ height }} className="flex items-end gap-3">
        {data.map((d) => (
          <div key={d.label} className="flex-1 flex flex-col items-center group">
            <span className="text-xs font-semibold text-slate-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {d.value}
            </span>
            <div
              className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
              style={{
                height: `${(d.value / max) * (height - 40)}px`,
                background: d.color || 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)',
              }}
            />
            <span className="text-xs text-slate-600 mt-2 truncate max-w-full">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};