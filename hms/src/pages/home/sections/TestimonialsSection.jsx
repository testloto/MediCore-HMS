import React, { memo } from 'react';
import { TESTIMONIALS } from './homeData';

const TestimonialsSection = memo(() => (
  <section style={{ padding:'80px 24px', background:'var(--surface2)' }}>
    <div style={{ maxWidth:1200, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:48 }}>
        <div style={{ fontSize:11, color:'#18ae94', fontWeight:700, letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>PATIENT STORIES</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:700, color:'var(--text)' }}>What Our Patients Say</h2>
      </div>
      <div className='home-tests'>
        {TESTIMONIALS.map(t => (
          <div key={t.name} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:24, boxShadow:'var(--card-shadow)' }}>
            <div style={{ fontSize:18, color:'#f59e0b', marginBottom:12 }}>{'★'.repeat(t.rating)}</div>
            <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.7, marginBottom:16, fontStyle:'italic' }}>"{t.text}"</p>
            <div style={{ display:'flex', alignItems:'center', gap:10, borderTop:'1px solid var(--border)', paddingTop:14 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#18ae94,#0e7a66)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:700, flexShrink:0 }}>{t.initials}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>{t.name}</div>
                <div style={{ fontSize:11, color:'var(--text3)' }}>📍 {t.city}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
));
TestimonialsSection.displayName = 'TestimonialsSection';
export default TestimonialsSection;
