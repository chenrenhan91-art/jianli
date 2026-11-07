import { useEffect, useRef } from 'react';

const GLYPHS = '01{}[]()<>=/+-*;_$#&|~^%ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/** 原站首页的代码雨：固定间隔下落，减少动效时不启动。 */
export function CodeRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canvas || reduce) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let drops: number[] = [];
    const size = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.ceil(canvas.width / 18);
      const rows = Math.ceil(canvas.height / 18);
      drops = Array.from({ length: cols }, () => Math.random() * rows);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    const tick = () => {
      ctx.fillStyle = 'rgba(0,0,0,.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff41';
      ctx.font = '15px ui-monospace, monospace';
      for (let i = 0; i < drops.length; i++) {
        const ch = GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
        ctx.fillText(ch, i * 18, drops[i] * 18);
        if (drops[i] * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        else drops[i] += 1;
      }
    };

    size();
    window.addEventListener('resize', size);
    const id = window.setInterval(tick, 70);
    return () => {
      window.removeEventListener('resize', size);
      window.clearInterval(id);
    };
  }, []);

  return <canvas id="rain" ref={ref} aria-hidden="true" />;
}
