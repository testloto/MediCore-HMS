import React, { memo, useCallback } from 'react';
import { DOCTORS_HIGHLIGHT } from './homeData';

const DocCard = memo(({ d, onRegister }) => {
  const handleEnter = useCallback(e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='var(--card-hover)'; }, []);
  const handleLeave = useCallback(e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='var(--card-shadow)'; }, []);
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:24, textAlign:'center', transition:'all 0.25s', boxShadow:'var(--card-shadow)', cursor:'pointer' }}
      onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <div style={{ width:64, height:64, borderRadius:20, background:d.color+'20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, margin:'0 auto 14px', border:`2px solid ${d.color}35` }}>{d.emoji}</div>
      <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{d.name}</div>
      <div style={{ fontSize:12, color:d.color, fontWeight:600, marginTop:3 }}>{d.spec}</div>
      <div style={{ fontSize:11, color:'var(--text3)', marginTop:5 }}>{d.exp} experience</div>
      <div style={{ fontSize:13, color:'#f59e0b', marginTop:8 }}>{'⭐'.repeat(5)} {d.rating}</div>
      <button onClick={onRegister} style={{ marginTop:14, width:'100%', padding:'8px', borderRadius:10, fontSize:12, fontWeight:600, background:d.color+'15', color:d.color, border:`1px solid ${d.color}30`, cursor:'pointer' }}>
        Book Appointment
      </button>
    </div>
  );
});
DocCard.displayName = 'DocCard';

const DoctorsSection = memo(({ onRegister }) => (
  <section id="doctors" style={{ padding:'80px 24px', background:'var(--surface2)' }}>
    <div style={{ maxWidth:1200, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:48 }}>
        <div style={{ fontSize:11, color:'#18ae94', fontWeight:700, letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>MEET THE TEAM</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:700, color:'var(--text)' }}>Our Expert Doctors</h2>
      </div>
      <div className='home-docs'>
        {DOCTORS_HIGHLIGHT.map(d => <DocCard key={d.name} d={d} onRegister={onRegister} />)}
      </div>
      <div style={{ textAlign:'center', marginTop:28 }}>
        <button onClick={onRegister} style={{ padding:'12px 28px', borderRadius:12, fontSize:13, fontWeight:600, background:'var(--surface)', color:'var(--text)', border:'1px solid var(--border)', cursor:'pointer' }}>
          View All 40+ Doctors →
        </button>
      </div>
    </div>
  </section>
));
DoctorsSection.displayName = 'DoctorsSection';
export default DoctorsSection;
