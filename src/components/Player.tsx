import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { musicSrc, profile } from '../data/profile';
import { useI18n } from '../i18n';
import { PauseIcon, PlayIcon } from './Icons';

const clock = (sec: number) => {
  if (!Number.isFinite(sec)) return '0:00';
  const whole = Math.floor(sec);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};

export function Player() {
  const tracks = profile.music.tracks;
  const { tr } = useI18n();
  const audioRef = useRef<HTMLAudioElement>(null);
  const wantPlay = useRef(true);
  const kickRef = useRef<(() => void) | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const track = tracks[current];

  const clearKick = () => {
    if (!kickRef.current) return;
    window.removeEventListener('pointerdown', kickRef.current, true);
    window.removeEventListener('keydown', kickRef.current, true);
    kickRef.current = null;
  };

  const tryPlay = (audio: HTMLAudioElement) => {
    if (!wantPlay.current) return;
    void audio.play().catch(() => {
      if (kickRef.current) return;
      const kick = () => {
        clearKick();
        if (!wantPlay.current) return;
        void audioRef.current?.play().catch(() => {});
      };
      kickRef.current = kick;
      window.addEventListener('pointerdown', kick, true);
      window.addEventListener('keydown', kick, true);
    });
  };

  useEffect(() => () => clearKick(), []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setTime(audio.currentTime);
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => {
      wantPlay.current = true;
      setCurrent((i) => (i + 1) % tracks.length);
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('durationchange', onMeta);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('durationchange', onMeta);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnd);
    };
  }, [tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = musicSrc(track.file);
    audio.load();
    setTime(0);
    setDuration(0);
    tryPlay(audio);
  }, [track.file]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      wantPlay.current = true;
      tryPlay(audio);
      return;
    }
    wantPlay.current = false;
    clearKick();
    audio.pause();
  };

  const select = (next: number) => {
    setOpen(false);
    if (next === current) {
      toggle();
      return;
    }
    wantPlay.current = true;
    setCurrent(next);
  };

  const ratio = duration ? Math.min(1, time / duration) : 0;
  const percent = ratio * 100;

  document.documentElement.dataset.deck = collapsed ? 'closed' : 'open';

  return (
    <div className={`deck ${playing ? 'is-playing' : ''} ${collapsed ? 'is-collapsed' : ''}`} ref={rootRef}>
      <audio ref={audioRef} preload="auto" autoPlay />
      <button type="button" className="deck-fold" aria-expanded={!collapsed} onClick={() => setCollapsed((v) => !v)}>
        {collapsed ? tr('展开磁带', 'Open') : tr('收起', 'Hide')}
      </button>
      {!collapsed && (
      <>
      {open && (
        <ul className="deck-menu" id="deck-menu" aria-label="曲目">
          {tracks.map((item, i) => (
            <li key={item.file}>
              <button type="button" aria-current={i === current ? 'true' : undefined} onClick={() => select(i)}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="cassette" aria-label="AI 创作">
        <div className="cassette-window">
          <i className="reel" style={{ '--tape': `${22 + (1 - ratio) * 10}px` } as CSSProperties}><b /></i>
          <i className="tape" aria-hidden="true" />
          <i className="reel right" style={{ '--tape': `${22 + ratio * 10}px` } as CSSProperties}><b /></i>
        </div>
        <button type="button" className="cassette-label" aria-expanded={open} aria-controls="deck-menu" onClick={() => setOpen((v) => !v)}>
          <strong>{track.title}</strong>
          <small>{tr(profile.music.credit, 'Original AI music')}</small>
        </button>
        <label className="seek-label deck-seek">
          <span className="sr">{tr('播放进度', 'Progress')}</span>
          <input
            className="seek"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(time, duration || 0)}
            style={{ '--ratio': `${percent}%` } as CSSProperties}
            aria-valuetext={`${clock(time)} / ${clock(duration)}`}
            onChange={(event) => {
              const audio = audioRef.current;
              const next = Number(event.target.value);
              if (audio) audio.currentTime = next;
              setTime(next);
            }}
          />
        </label>
        <div className="deck-controls">
          <button
            type="button"
            aria-label={tr('上一首', 'Previous')}
            onClick={() => {
              wantPlay.current = true;
              setCurrent((i) => (i - 1 + tracks.length) % tracks.length);
            }}
          >
            {tr('上一首', 'Prev')}
          </button>
          <button type="button" className="deck-play" aria-label={playing ? tr('暂停', 'Pause') : tr('播放', 'Play')} aria-pressed={playing} onClick={toggle}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            type="button"
            aria-label={tr('下一首', 'Next')}
            onClick={() => {
              wantPlay.current = true;
              setCurrent((i) => (i + 1) % tracks.length);
            }}
          >
            {tr('下一首', 'Next')}
          </button>
        </div>
        <p className="deck-time">
          {clock(time)} / {clock(duration)}
        </p>
      </div>
      </>
      )}
    </div>
  );
}
