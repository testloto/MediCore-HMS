import React, { useState, useRef, useEffect } from 'react';
import { useAuth, ROLE_META } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NOTIFICATIONS } from '../../data/mockData';

const TITLES = { dashboard:'Dashboard', patients:'Patients', doctors:'Doctors', appointments:'Appointments', billing:'Billing', pharmacy:'Pharmacy', lab:'Laboratory', staff:'Staff', settings:'Settings', permissions:'Permissions' };

export default function Topbar({ page, onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifRead, setNotifRead] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef(); const menuRef = useRef();
  const meta = user ? ROLE_META[user.role] : null;
  const unread = NOTIFICATIONS.filter(n => n.unread).length;

  useEffect(() => {
    const fn = e => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (menuRef.current  && !menuRef.current.contains(e.target))  setMenuOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const dropStyle = { position:'absolute', top:48, right:0, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, zIndex:70, boxShadow:'var(--modal-shadow)', animation:'fadeUp 0.2s ease' };

  return (
    <header className="hms-topbar">
      {/* Hamburger */}
      <button className="hms-burger" onClick={onMenuClick} aria-label="Menu">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      {/* Page title */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:14, fontWeight:600, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{TITLES[page]||'Dashboard'}</div>
        <div style={{ fontSize:10, color:'var(--text3)' }} className="hidden sm:block">MediCore Hospital</div>
      </div>

      {/* Search */}
      <div className="hms-tb-search">
        <svg width="13" height="13" fill="none" stroke="var(--text3)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input placeholder="Search…" style={{ background:'transparent', border:'none', outline:'none', fontSize:12, color:'var(--text)', width:'100%' }} />
      </div>

      {/* Live */}
      <div className="hms-live">
        <span style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', display:'inline-block', animation:'pulse 2s infinite' }} />
        <span style={{ fontSize:11, color:'#10b981', fontWeight:600 }}>Live</span>
      </div>

      {/* Notifications */}
      <div style={{ position:'relative' }} ref={notifRef}>
        <button className="btn-icon" style={{ position:'relative' }} onClick={() => { setNotifOpen(v=>!v); setNotifRead(true); }}>
          <svg width="15" height="15" fill="none" stroke="var(--text2)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          {!notifRead && unread > 0 && (
            <span style={{ position:'absolute', top:-2, right:-2, width:15, height:15, borderRadius:'50%', background:'#ef4444', color:'#fff', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid var(--surface)' }}>{unread}</span>
          )}
        </button>
        {notifOpen && (
          <div style={{ ...dropStyle, width:'min(320px,88vw)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>Notifications</span>
              <span style={{ fontSize:11, color:'var(--brand)', cursor:'pointer' }}>Mark all read</span>
            </div>
            <div style={{ maxHeight:260, overflowY:'auto' }}>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} style={{ display:'flex', gap:10, padding:'10px 14px', borderBottom:'1px solid var(--border)', cursor:'pointer' }}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <div style={{ width:30, height:30, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }} className={n.color}>{n.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'var(--text)' }}>{n.title}</div>
                    <div style={{ fontSize:11, color:'var(--text2)', marginTop:2 }}>{n.text}</div>
                    <div style={{ fontSize:10, color:'var(--text3)', marginTop:2 }}>{n.time}</div>
                  </div>
                  {n.unread && !notifRead && <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--brand)', marginTop:4, flexShrink:0 }} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Theme */}
      <button className="btn-icon" onClick={toggleTheme} style={{ fontSize:15 }}>{theme==='light'?'🌙':'☀️'}</button>

      {/* User */}
      <div style={{ position:'relative' }} ref={menuRef}>
        <button onClick={() => setMenuOpen(v=>!v)} style={{ display:'flex', alignItems:'center', gap:8, paddingLeft:10, borderLeft:'1px solid var(--border)', cursor:'pointer', background:'none', border:'none' }}>
          {user && <>
            <div className={`avatar avatar-sm bg-gradient-to-br ${user.avatarColor} text-white`}>{user.avatar}</div>
            <div className="hms-username">
              <span style={{ fontSize:12, fontWeight:600, color:'var(--text)', lineHeight:1.2 }}>
{(user?.name || user?.fullName || "")
   .split(" ")
   .pop()
}
</span>
              <span style={{ fontSize:10, color:'var(--brand)', fontWeight:600 }}>{meta?.label}</span>
            </div>
            <svg width="10" height="10" fill="none" stroke="var(--text3)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
          </>}
        </button>
        {menuOpen && user && (
          <div style={{ ...dropStyle, width:'min(250px,82vw)' }}>
            <div style={{ padding:14, borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
              <div className={`avatar avatar-md bg-gradient-to-br ${user.avatarColor} text-white`}>{user.avatar}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{user.name}</div>
                <div style={{ fontSize:11, color:'var(--text3)' }}>{user.email}</div>
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full border ${meta?.color}`}>{meta?.icon} {meta?.label}</span>
              </div>
            </div>
            <div style={{ padding:'6px 8px', borderBottom:'1px solid var(--border)' }}>
              {[['👤','My Profile'],['🔒','Change Password'],['⚙️','Preferences']].map(([ic,lb]) => (
                <button key={lb} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:9, fontSize:13, color:'var(--text2)', background:'none', border:'none', cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='var(--surface2)';e.currentTarget.style.color='var(--text)'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='var(--text2)'}}>
                  {ic} {lb}
                </button>
              ))}
            </div>
            <div style={{ padding:'6px 8px' }}>
              <button onClick={logout} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:9, fontSize:13, fontWeight:600, color:'#ef4444', background:'none', border:'none', cursor:'pointer', transition:'all 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.08)'}
                onMouseLeave={e=>e.currentTarget.style.background='none'}>
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
