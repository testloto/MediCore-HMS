import React, { memo } from 'react';

const HeroSection = memo(({ onLogin, onRegister }) => (
  <section style={{ padding:'80px 24px 96px', position:'relative', overflow:'hidden' }}>
    <div style={{ position:'absolute', top:-120, right:-120, width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle,rgba(24,174,148,0.09) 0%,transparent 70%)', pointerEvents:'none' }} />
    <div className='home-hero' style={{ maxWidth:1200, margin:'0 auto' }}>
      {/* Left */}
      <div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', background:'rgba(24,174,148,0.12)', border:'1px solid rgba(24,174,148,0.25)', borderRadius:20, fontSize:12, color:'#18ae94', fontWeight:600, marginBottom:22 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#18ae94', display:'inline-block', animation:'pulse 1.5s infinite' }} />
          NABH Accredited · Est. 2010
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:700, lineHeight:1.2, marginBottom:18, color:'var(--text)' }}>
          Your Health Is Our<br />
          <span style={{ background:'linear-gradient(135deg,#18ae94,#70e0c8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            Greatest Priority
          </span>
        </h1>
        <p style={{ fontSize:15, color:'var(--text2)', lineHeight:1.8, marginBottom:32, maxWidth:450 }}>
          MediCore Hospital delivers world-class multi-speciality care with 40+ expert doctors, cutting-edge diagnostics, and compassionate nursing — all under one roof.
        </p>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:28 }}>
          <button onClick={onRegister} style={{ padding:'13px 28px', borderRadius:12, fontSize:14, fontWeight:700, background:'#18ae94', color:'#fff', border:'none', cursor:'pointer', boxShadow:'0 4px 20px rgba(24,174,148,0.4)' }}>Book Appointment →</button>
          <button style={{ padding:'13px 24px', borderRadius:12, fontSize:14, fontWeight:600, background:'var(--surface2)', color:'var(--text)', border:'1px solid var(--border)', cursor:'pointer' }}>🩺 Our Specialists</button>
        </div>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
          {['NABH Accredited','ISO 9001:2015','JCI Certified','24/7 Emergency'].map(b => (
            <div key={b} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--text2)', fontWeight:600 }}>
              <span style={{ color:'#18ae94' }}>✓</span> {b}
            </div>
          ))}
        </div>
      </div>
      {/* Right — stats card */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:28, boxShadow:'var(--card-hover)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:16, color:'var(--text)' }}>Today's Overview</div>
              <div style={{ fontSize:11, color:'var(--text2)', marginTop:2 }}>Sunday, March 15, 2026</div>
            </div>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#18ae94', display:'inline-block', animation:'pulse 2s infinite' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[{label:'Outpatients',value:'184',color:'#18ae94'},{label:'Surgeries',value:'12',color:'#3b82f6'},{label:'Admitted',value:'98',color:'#f59e0b'},{label:'Emergencies',value:'7',color:'#ef4444'}].map(s => (
              <div key={s.label} style={{ background:'var(--surface2)', borderRadius:12, padding:14, border:'1px solid var(--border)' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:11, color:'var(--text2)', marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[{icon:'📞',label:'Helpline',value:'022-4455-6677',color:'#18ae94'},{icon:'🚑',label:'Emergency',value:'022-4455-0000',color:'#ef4444'}].map(c => (
            <div key={c.label} style={{ background:'var(--surface)', border:`1px solid ${c.color}30`, borderRadius:14, padding:'14px 16px', display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${c.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{c.icon}</div>
              <div>
                <div style={{ fontSize:10, color:'var(--text3)', textTransform:'uppercase', letterSpacing:1 }}>{c.label}</div>
                <div style={{ fontSize:13, fontWeight:700, color:c.color, marginTop:1 }}>{c.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
));
HeroSection.displayName = 'HeroSection';
export default HeroSection;
