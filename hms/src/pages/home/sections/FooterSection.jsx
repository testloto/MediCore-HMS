import React, { memo, useCallback } from 'react';
import { FOOTER_COLS } from './homeData';
import { useTheme } from '../../../context/ThemeContext';

const FooterSection = memo(() => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const handleLinkEnter = useCallback(e => { e.target.style.color = '#18ae94'; }, []);
  const handleLinkLeave = useCallback(e => { e.target.style.color = 'var(--text2)'; }, []);

  return (
    <footer id="contact" style={{ background:'var(--surface)', borderTop:'1px solid var(--border)', padding:'48px 24px 24px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div className='home-footer' style={{ marginBottom:36 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#18ae94,#0e7a66)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16 }}>⚕</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:'var(--text)' }}>MediCore Hospital</div>
            </div>
            <p style={{ fontSize:12, color:'var(--text2)', lineHeight:1.7, maxWidth:280 }}>NABH & JCI accredited multi-speciality hospital providing compassionate, world-class healthcare since 2010.</p>
            <div style={{ marginTop:14, fontSize:12, color:'var(--text2)', lineHeight:2 }}>
              <div>📍 Bandra West, Mumbai — 400050</div>
              <div>📞 022-4455-6677 &nbsp;|&nbsp; 🚑 022-4455-0000</div>
              <div>✉️ info@medicore.in</div>
            </div>
          </div>
          {FOOTER_COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontWeight:700, fontSize:11, color:'var(--text)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:14 }}>{col.title}</div>
              {col.links.map(l => (
                <div key={l} style={{ fontSize:12, color:'var(--text2)', marginBottom:8, cursor:'pointer', transition:'color 0.2s' }}
                  onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid var(--border)', paddingTop:20, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontSize:11, color:'var(--text3)' }}>© 2026 MediCore Hospital. All rights reserved.</div>
          <div style={{ display:'flex', gap:16 }}>
            {['Privacy Policy','Terms of Service','Disclaimer'].map(l => (
              <span key={l} style={{ fontSize:11, color:'var(--text3)', cursor:'pointer' }}>{l}</span>
            ))}
          </div>
          <button onClick={toggleTheme} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text2)', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8, padding:'6px 12px', cursor:'pointer' }}>
            {isLight ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </div>
    </footer>
  );
});
FooterSection.displayName = 'FooterSection';
export default FooterSection;
