import { profile } from '../data/profile';
import { jobsEn, useI18n } from '../i18n';
import { Tile } from './Tile';

export function ExperienceTile({ index }: { index: number }) {
  const { tr, lang } = useI18n();
  return (
    <Tile area="write" index={index} aria-label={tr('工作经历', 'Work')}>
      <div className="tile-head">
        <p className="label">{tr('工作经历', 'Work')}</p>
        <a className="more" href={profile.resumeUrl}>
          {tr('全部档案', 'Full archive')} <span aria-hidden="true">→</span>
        </a>
      </div>
      <ul className="jobs">
        {profile.jobs.map((job, i) => {
          const en = jobsEn[i];
          return (
            <li key={job.when} className="job">
              <div className="job-row">
                <span className="job-role">{lang === 'en' ? en.role : job.role}</span>
                <time>{lang === 'en' ? en.when : job.when}</time>
              </div>
              <p className="sub">
                {lang === 'en' ? en.where : job.where} · {lang === 'en' ? en.result : job.result}
              </p>
            </li>
          );
        })}
      </ul>
    </Tile>
  );
}
