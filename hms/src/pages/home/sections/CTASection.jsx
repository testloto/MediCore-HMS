import React, { memo } from 'react';

const CTASection = memo(({ onLogin, onRegister }) => (
  <section style={{ padding:'80px 24px', background:'linear-gradient(135deg,#0a4a3c,#18ae94 55%,#0d6b55)' }}>
    <div style={{ maxWidth:700, margin:'0 auto', textAlign:'center' }}>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:700, color:'#fff', marginBottom:14 }}>
        Ready for world-class care?
      </h2>
      <p style={{ fontSize:15, color:'rgba(255,255,255,0.8)', marginBottom:36, lineHeight:1.7 }}>
        Register today to book appointments, access your health records, get lab results online, and connect with our specialists.
      </p>
      <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
        <button onClick={onRegister} style={{ padding:'14px 32px', borderRadius:12, fontSize:15, fontWeight:700, background:'#fff', color:'#0a4a3c', border:'none', cursor:'pointer', boxShadow:'0 4px 20px rgba(0,0,0,0.2)' }}>
          Register Now →
        </button>
        <button onClick={onLogin} style={{ padding:'14px 28px', borderRadius:12, fontSize:15, fontWeight:600, background:'rgba(255,255,255,0.15)', color:'#fff', border:'1px solid rgba(255,255,255,0.3)', cursor:'pointer' }}>
          Sign In
        </button>
      </div>
    </div>
  </section>
));
CTASection.displayName = 'CTASection';
export default CTASection;
