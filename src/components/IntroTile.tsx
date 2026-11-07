import { asset, profile } from '../data/profile';
import { useI18n } from '../i18n';
import { Tile } from './Tile';

const stackEn = ['Cross-border commerce', 'AI products', 'Markets and data', 'Metaphysics'];

export function IntroTile({ index, onViewWork }: { index: number; onViewWork: () => void }) {
  const { name, nameEn, role, pitch, stack, availability, resumeUrl } = profile;
  const { lang, toggle, tr } = useI18n();
  const lines = lang === 'en' ? pitch.en : pitch.zh;
  return (
    <Tile area="intro" index={index} aria-label={tr('简介', 'Introduction')}>
      <button type="button" className="lang-switch" onClick={toggle}>
        {lang === 'zh' ? 'EN' : '中文'}
      </button>
      <div className="id">
        <img className="avatar" src={asset(profile.portrait)} alt="" />
        <div>
          <h1>
            {name}
            <span>{nameEn}</span>
          </h1>
          <p className="sub">{tr(role, 'AI full-stack developer · Monetization · AI artist · Metaphysician')}</p>
        </div>
      </div>
      <p className="pitch">
        {lines.map((line) => (
          <span key={line}>
            {line.split(/(逻辑思维|混沌秩序|logical thinking|chaos)/).map((part) =>
              part === '逻辑思维' || part === '混沌秩序' || part === 'logical thinking' || part === 'chaos' ? (
                <em key={part}>{part}</em>
              ) : (
                part
              ),
            )}
          </span>
        ))}
      </p>
      <ul className="chips" aria-label={tr('常用技术栈', 'Strengths')}>
        {stack.map((item, i) => (
          <li key={item}>{lang === 'en' ? stackEn[i] : item}</li>
        ))}
      </ul>
      <div className="intro-foot">
        <p className={`status ${availability.open ? 'is-open' : ''}`}>
          <span className="dot" aria-hidden="true" />
          {tr(availability.text, availability.textEn)}
        </p>
        <div className="actions">
          <button type="button" className="btn primary" onClick={onViewWork}>
            {tr('联系我', 'Contact')} <span aria-hidden="true">→</span>
          </button>
          <a className="btn" href={resumeUrl}>
            {tr('简历', 'Archive')}
          </a>
        </div>
      </div>
    </Tile>
  );
}
