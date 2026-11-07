import { useCallback, useMemo, useRef, useState } from 'react';
import { AiEvents } from './components/AiEvents';
import { CodeRain } from './components/CodeRain';
import { CommandPalette, type Command } from './components/CommandPalette';
import { ContactTile } from './components/ContactTile';
import { EducationTile } from './components/EducationTile';
import { ExperienceTile } from './components/ExperienceTile';
import { HeatmapTile } from './components/HeatmapTile';
import { IdentityTile } from './components/IdentityTile';
import { IntroTile } from './components/IntroTile';
import { Player } from './components/Player';
import { Toast } from './components/Toast';
import { WorkTile } from './components/WorkTile';
import { profile } from './data/profile';
import { useHotkeys } from './hooks/useHotkeys';
import { useSpotlight } from './hooks/useSpotlight';
import { useTheme } from './hooks/useTheme';
import { useToast } from './hooks/useToast';
import { copyText } from './lib/clipboard';
import { isMac } from './lib/time';
import { useI18n } from './i18n';

const openUrl = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { tr } = useI18n();
  const { message, show } = useToast();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const gridRef = useRef<HTMLElement>(null);
  useSpotlight(gridRef);

  const copyWechat = useCallback(async () => {
    const ok = await copyText(profile.wechat);
    show(ok ? tr(`微信已复制：${profile.wechat}`, `WeChat copied: ${profile.wechat}`) : tr(`复制失败，请手动复制：${profile.wechat}`, `Could not copy. Please copy it yourself: ${profile.wechat}`));
    return ok;
  }, [show, tr]);

  const focusContact = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const focusWork = useCallback(() => {
    const work = document.getElementById('work');
    work?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    work?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  }, []);

  useHotkeys({ onPalette: () => setPaletteOpen((o) => !o), onTheme: toggleTheme });

  const commands = useMemo<Command[]>(
    () => [
      { id: 'work', group: tr('操作', 'Actions'), label: tr('查看项目产品', 'View products'), keywords: 'work projects zuopin chanpin', run: focusWork },
      { id: 'copy', group: tr('操作', 'Actions'), label: tr('复制微信', 'Copy WeChat'), keywords: 'wechat copy weixin', run: () => void copyWechat() },
      { id: 'theme', group: tr('操作', 'Actions'), label: theme === 'dark' ? tr('切换为浅色主题', 'Switch to light') : tr('切换为深色主题', 'Switch to dark'), hint: 'T', keywords: 'theme dark light zhuti', run: toggleTheme },
      { id: 'resume', group: tr('操作', 'Actions'), label: tr('打开简历档案', 'Open the archive'), keywords: 'resume cv jianli', run: () => openUrl(profile.resumeUrl) },
      { id: 'phone', group: tr('链接', 'Links'), label: tr(`拨打 ${profile.phone}`, `Call ${profile.phone}`), keywords: 'phone tel dianhua', run: () => (window.location.href = `tel:${profile.phone}`) },
      { id: 'github', group: tr('链接', 'Links'), label: tr('打开 GitHub', 'Open GitHub'), keywords: 'github', run: () => openUrl(profile.github.url) },
      { id: 'codex', group: tr('链接', 'Links'), label: tr('打开 Codex 资料', 'Open Codex profile'), keywords: 'codex chatgpt', run: () => openUrl(profile.codex.url) },
      ...profile.products.map((p) => ({ id: `product-${p.id}`, group: tr('作品', 'Work'), label: p.name, hint: p.domain, keywords: `${p.tagline} ${p.domain}`, run: () => openUrl(p.url) })),
      ...profile.stores.map((s) => ({ id: `store-${s.id}`, group: tr('独立站', 'Storefronts'), label: s.name, hint: s.domain, keywords: `${s.metricLabel} dulizhan`, run: () => openUrl(s.url) })),
    ],
    [copyWechat, focusWork, theme, toggleTheme, tr],
  );

  return (
    <>
      <CodeRain />
      <div className="shell" id="top">
        <main className="grid" ref={gridRef}>
          <IntroTile index={0} onViewWork={focusContact} />
          <IdentityTile index={1} />
          <EducationTile index={2} />
          <WorkTile index={3} />
          <HeatmapTile index={4} />
          <AiEvents />
          <ExperienceTile index={5} />
          <ContactTile index={6} onCopy={copyWechat} />
        </main>
        <footer className="footer">
          <span>
            © {profile.updatedAt.slice(0, 4)} {profile.name} · {tr('更新于', 'Updated')} {profile.updatedAt}
          </span>
          <span className="footer-keys">
            <kbd>{isMac() ? '⌘' : 'Ctrl'} K</kbd> {tr('命令面板', 'Commands')} <kbd>T</kbd> {tr('切换主题', 'Theme')}
          </span>
        </footer>
      </div>
      <Player />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
      <Toast message={message} />
    </>
  );
}
