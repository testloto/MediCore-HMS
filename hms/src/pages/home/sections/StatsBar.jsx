import React, { memo } from 'react';
import { STATS } from './homeData';

const StatsBar = memo(() => (
  <section style={{ background:'linear-gradient(135deg,#0e7a66,#18ae94)', padding:'44px 24px' }}>
    <div className='home-stats' style={{ maxWidth:1200, margin:'0 auto' }}>
      {STATS.map((s,i) => (
        <div key={s.label} style={{ textAlign:'center', padding:'4px 0', borderRight:i<3?'1px solid rgba(255,255,255,0.15)':'none' }}>
          <div style={{ fontSize:28 }}>{s.icon}</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:700, color:'#fff', marginTop:4 }}>{s.value}</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.8)', fontWeight:500, marginTop:2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  </section>
));
StatsBar.displayName = 'StatsBar';
export default StatsBar;
