import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'zh' | 'en';

const KEY = 'crh-lang';

type Ctx = { lang: Lang; toggle: () => void; tr: (zh: string, en: string) => string };

const I18nContext = createContext<Ctx>({
  lang: 'zh',
  toggle: () => {},
  tr: (zh) => zh,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem(KEY) === 'en' ? 'en' : 'zh'));

  useEffect(() => {
    localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    document.title = lang === 'en' ? 'Chen Renhan' : '陈壬翰';
  }, [lang]);

  const toggle = () => setLang((current) => (current === 'zh' ? 'en' : 'zh'));
  const tr = (zh: string, en: string) => (lang === 'en' ? en : zh);
  return <I18nContext.Provider value={{ lang, toggle, tr }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export const productEn: Record<string, string> = {
  wxhc: 'BaZi, Zi Wei, Western astrology, Vedic',
  ora78: 'A tarot salon',
  lingtai: 'A sutra-chanting app, live on the App Store',
  luckyquant: 'Strategies, signals, and backtests',
  catcher: 'High-intent comments, pulled from the noise',
};

export const storeEn: Record<string, string> = {
  minshow: 'Solid walnut woodcraft',
  kaiju: 'Wooden jewelry and storage',
  mana: 'A trading storefront',
  furr: 'Pet furniture',
  superq: 'Storefront',
};

export const eventEn: Record<string, string> = {
  'events/guancha.jpg': '2026 Guancha Conference · OPC exhibitor',
  'events/shuqiwan.jpg': 'Shuqiwan · hosted an OPC cross-border monetization session',
  'events/ai-community.jpg': 'Hands-on meetup for an AI community',
  'events/duoduoland.jpg': 'DuoDuoland · offline pitch',
  'events/adventurex.jpg': 'AdventureX · exhibitor',
};

export const jobsEn = [
  { when: '2025.09 – present', role: 'Content and frontend', where: 'Jinyu Chuangwei, Hangzhou', result: 'Cross-border payments content, lead outreach, brand site and materials' },
  { when: '2025.02 – 2025.09', role: 'Independent founder', where: 'Storefronts and social', result: 'Shipped 5 storefronts. Grew TikTok and Instagram by 1,000+' },
  { when: '2024.06 – 2024.12', role: 'Insurance agent', where: 'Allianz Life, Zhejiang', result: 'Reached 300+ high-intent clients and closed 7 policies' },
  { when: '2024.04 – 2024.06', role: 'Research intern', where: 'Bank of Hangzhou, Investment, Qingchun HQ', result: 'Wrote 5 industry briefs on my own' },
  { when: '2023.06 – 2023.09', role: 'Booth sales intern', where: 'Informa', result: 'Converted 1,000+ names and closed 5 exhibitors' },
];

export const awardsEn = [
  'Second prize, Zhijiang Cup innovation contest',
  'First prize, business-plan competition',
  'Google official AI course certificate',
];

export const statEn: Record<string, { value?: string; label: string }> = {
  '累计 Token': { value: '9.3B', label: 'Tokens used' },
  '使用峰值': { value: '220M', label: 'Peak usage' },
  '最长任务': { value: '5h 9m', label: 'Longest task' },
  '最长连续': { label: 'Longest streak' },
  '当前连续': { label: 'Current streak' },
  '快速模式占比': { label: 'Fast mode share' },
  '最常用推理强度': { value: 'Very high · 35%', label: 'Usual reasoning level' },
  '已探索技能': { label: 'Skills explored' },
  '使用的技能': { label: 'Skills used' },
  '热门插件': { value: '7', label: 'Top plugins' },
};
