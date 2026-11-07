import { useEffect, type RefObject } from 'react';

/**
 * 聚光灯效果：鼠标在网格内移动时，把指针坐标写入每张卡片的 --x / --y。
 * 卡片内部光晕 + 相邻卡片边框会一起被“照亮”。用 rAF 节流，只响应鼠标。
 */
export function useSpotlight(ref: RefObject<HTMLElement | null>, selector = '.tile') {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let raf = 0;
    let last: PointerEvent | null = null;

    const update = () => {
      raf = 0;
      if (!last) return;
      root.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--x', `${last!.clientX - r.left}px`);
        el.style.setProperty('--y', `${last!.clientY - r.top}px`);
      });
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      last = e;
      if (!raf) raf = requestAnimationFrame(update);
    };

    root.addEventListener('pointermove', onMove);
    return () => {
      root.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [ref, selector]);
}
