import { useI18n } from '../i18n';
import { Tile } from './Tile';

const labels = [
  { zh: '城市', en: 'City', valueZh: '杭州', valueEn: 'Hangzhou' },
  { zh: '生日', en: 'Born', valueZh: '2000.04.30', valueEn: '30 Apr 2000' },
  { zh: '类型', en: 'Type', valueZh: 'INTP', valueEn: 'INTP' },
];

export function IdentityTile({ index }: { index: number }) {
  const { tr } = useI18n();
  return (
    <Tile area="clock" index={index} aria-label={tr('基本信息', 'Basics')}>
      <p className="label">{tr('基本信息', 'Basics')}</p>
      <ul className="facts">
        {labels.map((item) => (
          <li key={item.zh}>
            <span>{tr(item.zh, item.en)}</span>
            <b>{tr(item.valueZh, item.valueEn)}</b>
          </li>
        ))}
      </ul>
    </Tile>
  );
}
