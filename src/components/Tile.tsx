import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

type TileProps = HTMLAttributes<HTMLElement> & {
  area: string;
  /** 入场动画的顺序，用于错峰延迟 */
  index: number;
  children: ReactNode;
};

/** 所有 Bento 卡片的外壳：网格区域 + 聚光灯 + 入场动画 */
export function Tile({ area, index, className = '', style, children, ...rest }: TileProps) {
  return (
    <section className={`tile tile--${area} ${className}`} style={{ gridArea: area, '--i': index, ...style } as CSSProperties} {...rest}>
      {children}
    </section>
  );
}
