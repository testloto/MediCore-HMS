import React, { memo, useCallback } from 'react';
import { DEPARTMENTS } from './homeData';

const DeptCard = memo(({ d }) => {
  const handleEnter = useCallback(e => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = 'var(--card-hover)';
    e.currentTarget.style.borderColor = d.color + '60';
  }, [d.color]);
  const handleLeave = useCallback(e => {
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.boxShadow = 'var(--card-shadow)';
    e.currentTarget.style.borderColor = 'var(--border)';
  }, []);
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:24, cursor:'pointer', transition:'all 0.25s', boxShadow:'var(--card-shadow)' }}
      onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <div style={{ width:48, height:48, borderRadius:14, background:d.color+'18', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, marginBottom:14, border:`1px solid ${d.color}25` }}>{d.icon}</div>
      <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:6 }}>{d.name}</div>
      <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.6 }}>{d.desc}</div>
      <div style={{ marginTop:14, fontSize:12, fontWeight:600, color:d.color }}>Learn more →</div>
    </div>
  );
});
DeptCard.displayName = 'DeptCard';

const DepartmentsSection = memo(() => (
  <section id="departments" style={{ padding:'80px 24px' }}>
    <div style={{ maxWidth:1200, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:48 }}>
        <div style={{ fontSize:11, color:'#18ae94', fontWeight:700, letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>OUR SPECIALITIES</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:700, color:'var(--text)' }}>Departments & Services</h2>
        <p style={{ fontSize:14, color:'var(--text2)', marginTop:10, maxWidth:480, margin:'10px auto 0' }}>World-class care across 20+ specialities with the latest technology and experienced specialists.</p>
      </div>
      <div className='home-depts'>
        {DEPARTMENTS.map(d => <DeptCard key={d.name} d={d} />)}
      </div>
    </div>
  </section>
));
DepartmentsSection.displayName = 'DepartmentsSection';
export default DepartmentsSection;
