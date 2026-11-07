import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { SearchIcon } from './Icons';

export type Command = {
  id: string;
  label: string;
  group: string;
  hint?: string;
  /** 额外的搜索关键词（英文、拼音等） */
  keywords?: string;
  run: () => void;
};

type Props = { open: boolean; onClose: () => void; commands: Command[] };

export function CommandPalette({ open, onClose, commands }: Props) {
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      restoreRef.current = document.activeElement as HTMLElement | null;
      setQuery('');
      setSel(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      restoreRef.current?.focus?.();
    }
  }, [open]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.group} ${c.keywords ?? ''}`.toLowerCase().includes(q));
  }, [query, commands]);

  useEffect(() => setSel(0), [query]);
  useEffect(() => {
    if (open && list[sel]) document.getElementById(`cmd-${list[sel].id}`)?.scrollIntoView({ block: 'nearest' });
  }, [sel, list, open]);

  if (!open) return null;

  const run = (c: Command) => {
    onClose();
    window.setTimeout(c.run, 20); // 先关闭并归还焦点，再执行命令
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel((s) => (list.length ? (s + 1) % list.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel((s) => (list.length ? (s - 1 + list.length) % list.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (list[sel]) run(list[sel]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      e.preventDefault(); // 焦点保持在输入框内
    }
  };

  let lastGroup = '';
  return (
    <div className="palette-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="命令面板" onKeyDown={onKeyDown}>
        <div className="palette-input">
          <SearchIcon />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入命令或搜索…"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={list[sel] ? `cmd-${list[sel].id}` : undefined}
            aria-autocomplete="list"
          />
          <kbd>Esc</kbd>
        </div>
        <ul id="palette-list" role="listbox" aria-label="命令">
          {list.map((c, i) => {
            const header = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            return [
              header && (
                <li key={`g-${header}`} role="presentation" className="palette-group">
                  {header}
                </li>
              ),
              <li
                key={c.id}
                id={`cmd-${c.id}`}
                role="option"
                aria-selected={i === sel}
                className="palette-item"
                onMouseMove={() => i !== sel && setSel(i)}
                onClick={() => run(c)}
              >
                <span>{c.label}</span>
                {c.hint && <kbd>{c.hint}</kbd>}
              </li>,
            ];
          })}
        </ul>
        {!list.length && <p className="palette-empty">没有匹配“{query}”的结果</p>}
        <div className="palette-foot" aria-hidden="true">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> 选择
          </span>
          <span>
            <kbd>↵</kbd> 执行
          </span>
          <span>
            <kbd>Esc</kbd> 关闭
          </span>
        </div>
      </div>
    </div>
  );
}
