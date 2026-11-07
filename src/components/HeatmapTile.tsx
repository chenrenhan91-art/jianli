import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import githubYear from '../data/github-year.json';
import { asset, profile } from '../data/profile';
import { describeDay, fetchContributions, toWeeks, type Day } from '../lib/contributions';
import { statEn, useI18n } from '../i18n';
import { Tile } from './Tile';

const snapshot = githubYear.contributions as Day[];

const GAP = 3;

export function HeatmapTile({ index }: { index: number }) {
  const { username, live, url } = profile.github;
  const { lang, tr } = useI18n();
  const [days, setDays] = useState<Day[]>(snapshot);
  const [isLive, setIsLive] = useState(false);
  const [box, setBox] = useState({ weeks: 20, size: 12 });
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null);
  const cellsRef = useRef<HTMLDivElement>(null);

  // 可选：拉取真实 GitHub 数据，失败时保留演示数据
  useEffect(() => {
    if (!live) return;
    const ctrl = new AbortController();
    fetchContributions(username, ctrl.signal)
      .then((d) => {
        if (d.length) {
          setDays(d);
          setIsLive(true);
        }
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [live, username]);

  // 根据容器尺寸计算格子大小与可显示的周数
  useLayoutEffect(() => {
    const el = cellsRef.current;
    if (!el) return;
    const measure = () => {
      const size = Math.max(8, Math.min(14, Math.floor((el.clientHeight - GAP * 6) / 7)));
      const weeks = Math.max(8, Math.min(53, Math.floor((el.clientWidth + GAP) / (size + GAP))));
      setBox((b) => (b.size === size && b.weeks === weeks ? b : { size, weeks }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const allWeeks = useMemo(() => toWeeks(days), [days]);
  const weeks = allWeeks.slice(-box.weeks);
  const total = days.reduce((sum, d) => sum + d.count, 0);
  const flat = weeks.flat();

  const onOver = (e: PointerEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-i]');
    const day = cell ? flat[Number(cell.dataset.i)] : null;
    if (!cell || !day) return setTip(null);
    const host = cellsRef.current!.getBoundingClientRect();
    const r = cell.getBoundingClientRect();
    setTip({ text: describeDay(day, lang), x: r.left - host.left + r.width / 2, y: r.top - host.top });
  };

  return (
    <Tile area="heat" index={index} aria-label={tr('GitHub 与 Codex', 'GitHub and Codex')}>
      <div className="tile-head">
        <p className="label">
          {tr('GitHub 贡献', 'GitHub')} ·{' '}
          <a href={url} target="_blank" rel="noreferrer">
            <b>{username}</b>
          </a>{' '}
          · <b>{tr(`近一年 ${total.toLocaleString('zh-CN')} 次`, `${total.toLocaleString('en-US')} this year`)}</b>
        </p>
        <span className="badge">{isLive ? tr('实时', 'Live') : tr('公开记录', 'Public record')}</span>
      </div>
      <div className="cells-wrap">
        <div
          className="cells"
          ref={cellsRef}
          role="img"
          aria-label={tr(`${username} 近一年 ${total} 次贡献的热力图`, `${username}, ${total} contributions this year`)}
          style={{ gridTemplateRows: `repeat(7, ${box.size}px)`, gridAutoColumns: `${box.size}px` }}
          onPointerOver={onOver}
          onPointerLeave={() => setTip(null)}
        >
          {flat.map((d, i) => (d ? <i key={d.date} data-i={i} className={`l${d.level}`} /> : <i key={`pad-${i}`} className="pad" />))}
        </div>
        {tip && (
          <div className="tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
            {tip.text}
          </div>
        )}
      </div>
      <div className="legend" aria-hidden="true">
        {tr('少', 'Less')} <i className="l0" />
        <i className="l1" />
        <i className="l2" />
        <i className="l3" />
        <i className="l4" /> {tr('多', 'More')}
      </div>
      <div className="codex">
        <div className="tile-head">
          <p className="label">
            Codex · <b>{profile.codex.name}</b> @{profile.codex.handle}
          </p>
          <a className="more" href={profile.codex.url} target="_blank" rel="noreferrer">
            {tr('资料页', 'Profile')} <span aria-hidden="true">→</span>
          </a>
        </div>
        <ul className="codex-stats">
          {profile.codex.stats.map((stat) => {
            const en = statEn[stat.label];
            return (
              <li key={stat.label}>
                <b>{lang === 'en' && en?.value ? en.value : stat.value}</b>
                <span>{lang === 'en' && en ? en.label : stat.label}</span>
              </li>
            );
          })}
        </ul>
        <ul className="codex-stats is-insight">
          {profile.codex.insights.map((stat) => {
            const en = statEn[stat.label];
            return (
              <li key={stat.label}>
                <b>{lang === 'en' && en?.value ? en.value : stat.value}</b>
                <span>{lang === 'en' && en ? en.label : stat.label}</span>
              </li>
            );
          })}
        </ul>
        <p className="sub codex-asof">{tr(`取自资料页 ${profile.codex.capturedOn}`, `From the profile, ${profile.codex.capturedOn}`)}</p>
        <div className="ide">
          <p className="label">{tr('IDE和AI工具经验', 'IDEs and AI tools')}</p>
          <ul className="ide-row">
            {profile.tools.map((tool) => (
              <li key={tool.name}>
                <img src={asset(tool.logo)} alt="" width={16} height={16} />
                <span>
                  <b>{tool.name}</b>
                  {tool.note ? <small>{tr(tool.note, 'Social automation')}</small> : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Tile>
  );
}
