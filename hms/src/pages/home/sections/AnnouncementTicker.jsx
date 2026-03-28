import React, { memo, useState, useEffect } from 'react';
import { ANNOUNCEMENTS } from './homeData';

const AnnouncementTicker = memo(() => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p+1) % ANNOUNCEMENTS.length), 3500);
    return () => clearInterval(t);
  }, []);
  const ann = ANNOUNCEMENTS[idx];
  return (
    <div style={{ background:'#18ae94', color:'#fff', padding:'8px 24px', display:'flex', alignItems:'center', gap:12 }}>
      <span style={{ fontSize:10, fontWeight:800, letterSpacing:1.5, textTransform:'uppercase', background:'rgba(255,255,255,0.2)', padding:'2px 8px', borderRadius:4, flexShrink:0 }}>
        {ann.type==='new'?'🆕 NEW':ann.type==='event'?'📅 EVENT':'ℹ INFO'}
      </span>
      <span style={{ fontSize:13, fontWeight:500 }}>{ann.text}</span>
      <span style={{ marginLeft:'auto', fontSize:11, opacity:0.8, flexShrink:0 }}>📞 Emergency: 022-4455-0000</span>
    </div>
  );
});
AnnouncementTicker.displayName = 'AnnouncementTicker';
export default AnnouncementTicker;
