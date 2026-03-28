import React, { memo } from 'react';
import { WHY_US } from './homeData';

const WhyUsSection = memo(() => (
  <section id="about" style={{ padding:'80px 24px' }}>
    <div className='home-why' style={{ maxWidth:1200, margin:'0 auto' }}>
      <div>
        <div style={{ fontSize:11, color:'#18ae94', fontWeight:700, letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>WHY CHOOSE US</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:700, color:'var(--text)', marginBottom:14 }}>
          Committed to Your Care Since 2010
        </h2>
        <p style={{ fontSize:14, color:'var(--text2)', lineHeight:1.8, marginBottom:28 }}>
          MediCore Hospital combines medical excellence with compassionate care. From diagnostics to surgery to rehabilitation, we are your complete healthcare partner.
        </p>
        {WHY_US.map(f => (
          <div key={f.title} style={{ display:'flex', gap:14, marginBottom:18 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:'rgba(24,174,148,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0, border:'1px solid rgba(24,174,148,0.2)' }}>{f.icon}</div>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>{f.title}</div>
              <div style={{ fontSize:12, color:'var(--text2)', marginTop:3, lineHeight:1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className='home-facts'>
        {[
          {label:'Years of Service',value:'15+',icon:'📅',color:'#18ae94'},
          {label:'Surgeries',       value:'50K+',icon:'⚕️',color:'#3b82f6'},
          {label:'Daily OPD',       value:'500+',icon:'👥',color:'#f59e0b'},
          {label:'Specialists',     value:'40+', icon:'🩺',color:'#a855f7'},
          {label:'ICU Beds',        value:'40',  icon:'🛏',color:'#ef4444'},
          {label:'Satisfaction',    value:'98.7%',icon:'❤️',color:'#ec4899'},
        ].map(s => (
          <div key={s.label} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:'18px 16px', textAlign:'center', boxShadow:'var(--card-shadow)' }}>
            <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:11, color:'var(--text2)', marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
));
WhyUsSection.displayName = 'WhyUsSection';
export default WhyUsSection;
