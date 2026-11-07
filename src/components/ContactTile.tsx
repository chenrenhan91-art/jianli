import { useState } from 'react';
import { asset, profile } from '../data/profile';
import { useI18n } from '../i18n';
import { Tile } from './Tile';

export function ContactTile({ index, onCopy }: { index: number; onCopy: () => Promise<boolean> }) {
  const { tr } = useI18n();
  const [done, setDone] = useState(false);
  const handle = async () => {
    if (await onCopy()) {
      setDone(true);
      window.setTimeout(() => setDone(false), 1600);
    }
  };
  return (
    <Tile area="contact" id="contact" index={index} aria-label={tr('联系', 'Contact')}>
      <p className="label">{tr('联系', 'Contact')}</p>
      <img className="qr" src={asset(profile.wechatQr)} alt="微信二维码，扫码添加" width={148} height={148} />
      <a className="mail" href={`tel:${profile.phone}`}>
        {profile.phone}
      </a>
      <p className="sub wechat">{tr('微信', 'WeChat')} {profile.wechat}</p>
      <div className="contact-actions">
        <button type="button" className={`copy ${done ? 'done' : ''}`} onClick={handle}>
          {done ? tr('已复制 ✓', 'Copied') : tr('复制微信', 'Copy WeChat')}
        </button>
      </div>
    </Tile>
  );
}
