export type ZonedParts = { year: number; month: number; day: number; hour: number; minute: number; second: number };

export function zonedParts(date: Date, timeZone: string): ZonedParts {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const p = Object.fromEntries(f.formatToParts(date).map((x) => [x.type, x.value]));
  return { year: +p.year, month: +p.month, day: +p.day, hour: +p.hour % 24, minute: +p.minute, second: +p.second };
}

/** 某时区相对 UTC 的偏移（分钟） */
export function tzOffsetMinutes(date: Date, timeZone: string) {
  const p = zonedParts(date, timeZone);
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUTC - date.getTime()) / 60000);
}

/** 生成「比你快 8 小时」这类相对访客的时差描述 */
export function relativeToVisitor(date: Date, timeZone: string) {
  const visitor = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const diff = (tzOffsetMinutes(date, timeZone) - tzOffsetMinutes(date, visitor)) / 60;
  if (diff === 0) return '与你处于同一时区';
  const h = Math.abs(diff);
  const text = Number.isInteger(h) ? String(h) : h.toFixed(1);
  return diff > 0 ? `比你快 ${text} 小时` : `比你慢 ${text} 小时`;
}

export const pad2 = (n: number) => String(n).padStart(2, '0');

export const formatDuration = (sec: number) => `${pad2(Math.floor(sec / 60))}:${pad2(Math.floor(sec % 60))}`;

/** 2026-10-28 → 10.28 */
export const shortDate = (iso: string) => iso.slice(5).replace('-', '.');

export const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);
