import { useState } from 'react';
import { asset, profile } from '../data/profile';
import { productEn, storeEn, useI18n } from '../i18n';
import { ArrowUpRight } from './Icons';
import { Tile } from './Tile';

type Row = { id: string; name: string; metricLabel: string; url: string; logo?: string };

export function WorkTile({ index }: { index: number }) {
  const [stores, setStores] = useState(false);
  const { lang, tr } = useI18n();
  const rows: Row[] = stores ? profile.stores : profile.products;

  return (
    <Tile area="work" index={index} id="work" aria-label={stores ? tr('独立站', 'Storefronts') : tr('项目产品', 'Products')}>
      <div className="tile-head">
        <p className="label">{stores ? tr('独立站', 'Storefronts') : tr('项目产品', 'Products')}</p>
        <button type="button" className={`seg-btn ${stores ? '' : 'is-hot'}`} aria-pressed={stores} onClick={() => setStores((on) => !on)}>
          {stores ? tr('项目产品', 'Products') : tr('独立站', 'Storefronts')}
        </button>
      </div>
      <ul className="proj-rows">
        {rows.map((item) => (
          <li key={item.id}>
            {item.logo ? (
              <img src={asset(item.logo)} alt="" />
            ) : (
              <span className="logo-mark" aria-hidden="true">
                {item.name.slice(0, 1)}
              </span>
            )}
            <div>
              <h3>{item.name}</h3>
              <p>{lang === 'en' ? (stores ? storeEn[item.id] : productEn[item.id]) : item.metricLabel}</p>
            </div>
            <a href={item.url} target="_blank" rel="noreferrer">
              {tr('打开', 'Open')}
              <ArrowUpRight />
            </a>
          </li>
        ))}
      </ul>
    </Tile>
  );
}
