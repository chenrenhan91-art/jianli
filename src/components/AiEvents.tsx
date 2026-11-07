import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { asset, profile } from '../data/profile';
import { eventEn, useI18n } from '../i18n';

export function AiEvents() {
  const shots = profile.events;
  const { tr, lang } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open == null) {
      returnRef.current?.focus?.();
      returnRef.current = null;
      return;
    }
    if (!returnRef.current) returnRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
      if (event.key === 'ArrowRight') setOpen((i) => (i == null ? i : (i + 1) % shots.length));
      if (event.key === 'ArrowLeft') setOpen((i) => (i == null ? i : (i - 1 + shots.length) % shots.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, shots.length]);

  const shot = open == null ? null : shots[open];

  return (
    <section className="events" id="events" aria-label={tr('线下AI活动经历', 'Offline AI events')}>
      <div className="tile-head">
        <h2>{tr('线下AI活动经历', 'Offline AI events')}</h2>
      </div>
      <ul className="event-row">
        {shots.map((item, index) => (
          <li key={item.src}>
            <button type="button" className="event-card" onClick={() => setOpen(index)}>
              <img src={asset(item.src)} alt={lang === 'en' ? eventEn[item.src] : item.alt} />
              <span>{lang === 'en' ? eventEn[item.src] : item.caption}</span>
            </button>
          </li>
        ))}
      </ul>
      {shot && open != null && createPortal(
        <div className="viewer" role="dialog" aria-modal="true" aria-label={shot.caption} onClick={() => setOpen(null)}>
          <button type="button" className="viewer-close" ref={closeRef} onClick={() => setOpen(null)}>
            {tr('关闭', 'Close')}
          </button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={asset(shot.src)} alt={shot.alt} />
            <figcaption>
              <span>{lang === 'en' ? eventEn[shot.src] : shot.caption}</span>
              <span>
                {open + 1} / {shots.length}
              </span>
            </figcaption>
          </figure>
          <div className="viewer-navs">
            <button
              type="button"
              className="viewer-nav"
              aria-label={tr('上一张', 'Previous')}
              onClick={(event) => {
                event.stopPropagation();
                setOpen((open - 1 + shots.length) % shots.length);
              }}
            >
              {tr('上一张', 'Previous')}
            </button>
            <button
              type="button"
              className="viewer-nav"
              aria-label={tr('下一张', 'Next')}
              onClick={(event) => {
                event.stopPropagation();
                setOpen((open + 1) % shots.length);
              }}
            >
              {tr('下一张', 'Next')}
            </button>
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}
