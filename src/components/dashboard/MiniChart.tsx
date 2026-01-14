import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { useEffect, useRef, useState } from 'react';

interface MiniChartProps {
  data: { value: number }[];
  color?: string;
  height?: number;
}

const MiniChart = ({ data, color = 'hsl(142, 76%, 36%)', height = 60 }: MiniChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.style.setProperty('--chart-height', `${height}px`);
    }
  }, [height]);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const tooltipStyle = {
    background: isDark ? 'hsl(240, 10%, 8%)' : 'hsl(0, 0%, 100%)',
    border: isDark ? '1px solid hsl(240, 5%, 18%)' : '1px solid hsl(0, 0%, 90%)',
    borderRadius: '0px',
    fontSize: '12px',
    fontFamily: 'SF Mono, ui-monospace, monospace',
    color: isDark ? 'hsl(0, 0%, 95%)' : 'hsl(0, 0%, 0%)'
  };

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
            contentStyle={tooltipStyle}
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
