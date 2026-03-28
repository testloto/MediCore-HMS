import React, { memo, useCallback } from 'react';
import { useTheme } from '../../../context/ThemeContext';

const NavBar = memo(({ onLogin, onRegister }) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const handleLinkEnter = useCallback(e => { e.target.style.background='var(--surface2)'; e.target.style.color='var(--text)'; }, []);
  const handleLinkLeave = useCallback(e => { e.target.style.background='transparent'; e.target.style.color='var(--text2)'; }, []);

  return (
    <nav style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(20px)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:11, background:'linear-gradient(135deg,#18ae94,#0e7a66)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:20, fontWeight:700, boxShadow:'0 0 18px rgba(24,174,148,0.4)', flexShrink:0 }}>⚕</div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:16, color:'var(--text)', lineHeight:1.1 }}>MediCore</div>
            <div style={{ fontSize:9, color:'var(--text3)', letterSpacing:2.5, textTransform:'uppercase' }}>Hospital</div>
          </div>
        </div>
        {/* Links */}
        <div className='hms-home-nav-links' style={{ display:'flex', alignItems:'center', gap:2 }}>
          {['About','Departments','Doctors','Services','Contact'].map(l => (
            <a key={l} href={'#'+l.toLowerCase()} style={{ padding:'7px 14px', borderRadius:8, fontSize:13, fontWeight:500, color:'var(--text2)', textDecoration:'none', transition:'all 0.2s', display:'block' }}
              onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>{l}</a>
          ))}
        </div>
        {/* Actions */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={toggleTheme} title="Toggle theme" style={{ width:36, height:36, borderRadius:10, background:'var(--surface2)', border:'1px solid var(--border)', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {isLight ? '🌙' : '☀️'}
          </button>
          <button onClick={onLogin} style={{ padding:'8px 18px', borderRadius:10, fontSize:13, fontWeight:600, background:'var(--surface2)', border:'1px solid var(--border)', color:'var(--text)', cursor:'pointer' }}>Sign In</button>
          <button onClick={onRegister} style={{ padding:'8px 20px', borderRadius:10, fontSize:13, fontWeight:700, background:'#18ae94', color:'#fff', border:'none', cursor:'pointer', boxShadow:'0 0 14px rgba(24,174,148,0.35)' }}>Register</button>
        </div>
      </div>
    </nav>
  );
});
NavBar.displayName = 'NavBar';
export default NavBar;
