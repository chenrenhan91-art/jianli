import { mulberry32 } from './random';
import { zonedParts } from './time';

export type Level = 0 | 1 | 2 | 3 | 4;
export type Day = { date: string; count: number; level: Level };

export const levelOf = (count: number): Level => (count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4);

/** 演示数据：用固定种子生成「看起来真实」的一年提交记录（周末更少） */
export function seededContributions(seed: number, today: Date, timeZone: string, days = 371): Day[] {
  const r = mulberry32(seed);
  const p = zonedParts(today, timeZone);
  const end = Date.UTC(p.year, p.month - 1, p.day);
  const out: Day[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end - i * 864e5);
    const weekday = d.getUTCDay();
    const v = r();
    let count =
      v < 0.24 ? 0 : v < 0.5 ? 1 + Math.floor(r() * 2) : v < 0.75 ? 3 + Math.floor(r() * 3) : v < 0.92 ? 6 + Math.floor(r() * 4) : 10 + Math.floor(r() * 8);
    if ((weekday === 0 || weekday === 6) && r() < 0.55) count = Math.floor(count / 3);
    out.push({ date: d.toISOString().slice(0, 10), count, level: levelOf(count) });
  }
  return out;
}

/**
 * 真实数据：使用开源的 github-contributions-api（无需 token）。
 * 也可以换成自己的 Serverless 接口（GitHub GraphQL contributionsCollection）。
 */
export async function fetchContributions(username: string, signal?: AbortSignal): Promise<Day[]> {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as { contributions: { date: string; count: number; level: number }[] };
  return json.contributions.map((c) => ({ date: c.date, count: c.count, level: Math.max(0, Math.min(4, c.level)) as Level }));
}

/** 按周（周日开头）切分，第一列前面补空位，保证每行对应同一个星期几 */
export function toWeeks(days: Day[]): (Day | null)[][] {
  if (!days.length) return [];
  const pad = new Date(days[0].date + 'T00:00:00Z').getUTCDay();
  const cells: (Day | null)[] = [...Array<null>(pad).fill(null), ...days];
  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export function describeDay(d: Day, lang: 'zh' | 'en' = 'zh') {
  const date = new Date(d.date + 'T00:00:00Z');
  if (lang === 'en') {
    const label = `${WEEKDAYS_EN[date.getUTCDay()]} ${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
    return `${label} · ${d.count ? `${d.count} contributions` : 'No contributions'}`;
  }
  const label = `${date.getUTCMonth() + 1}月${date.getUTCDate()}日 ${WEEKDAYS[date.getUTCDay()]}`;
  return `${label} · ${d.count ? `${d.count} 次贡献` : '无贡献'}`;
}
