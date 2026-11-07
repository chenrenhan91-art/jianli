import { profile } from '../data/profile';
import { awardsEn, useI18n } from '../i18n';
import { Tile } from './Tile';

export function EducationTile({ index }: { index: number }) {
  const { school, major, years, college, awards } = profile.education;
  const { lang, tr } = useI18n();
  return (
    <Tile area="build" index={index} aria-label={tr('教育', 'Education')}>
      <p className="label">{tr('教育', 'Education')}</p>
      <h2 className="build-name">{tr(school, 'Zhejiang University of Technology')}</h2>
      <p className="sub">{tr(`${major} · ${college}`, 'Financial Engineering, B.S. · Business School')}</p>
      <p className="meta">
        <span>{years}</span>
      </p>
      <ul className="awards">
        {awards.map((award, i) => (
          <li key={award}>{lang === 'en' ? awardsEn[i] : award}</li>
        ))}
      </ul>
    </Tile>
  );
}
