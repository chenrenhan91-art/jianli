import { useMemo } from 'react';
import { mulberry32 } from '../lib/random';

/** 根据种子生成一条整体上扬的趋势线（纯装饰） */
export function Sparkline({ seed, points = 24 }: { seed: number; points?: number }) {
  const { line, area } = useMemo(() => {
    const r = mulberry32(seed);
    const w = 240;
    const h = 64;
    let v = 0.25 + r() * 0.15;
    const ys: number[] = [];
    for (let i = 0; i < points; i++) {
      v = Math.min(0.95, Math.max(0.05, v + (r() - 0.38) * 0.12));
      ys.push(v);
    }
    const xy = ys.map((y, i) => [(i / (points - 1)) * w, h - y * h] as const);
    const line = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
    return { line, area: `${line} L${w} ${h} L0 ${h} Z` };
  }, [seed, points]);

  return (
    <svg className="spark" viewBox="0 0 240 64" preserveAspectRatio="none" aria-hidden="true">
      <path className="spark-area" d={area} />
      <path className="spark-line" d={line} pathLength={1} />
    </svg>
  );
}
