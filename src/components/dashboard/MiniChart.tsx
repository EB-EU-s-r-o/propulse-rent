import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { useEffect, useRef } from 'react';

interface MiniChartProps {
  data: { value: number }[];
  color?: string;
  height?: number;
}

const MiniChart = ({ data, color = 'hsl(217, 91%, 60%)', height = 60 }: MiniChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.style.setProperty('--chart-height', `${height}px`);
    }
  }, [height]);

  return (
    <div
      ref={chartRef}
      className="w-full h-[var(--chart-height)]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              background: 'hsl(240, 10%, 6%)',
              border: '1px solid hsl(240, 5%, 18%)',
              borderRadius: '0px',
              fontSize: '12px',
              fontFamily: 'JetBrains Mono, monospace'
            }}
            labelStyle={{ display: 'none' }}
            formatter={(value: number) => [`฿${value.toLocaleString()}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${color})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniChart;
