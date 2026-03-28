import React, { useState } from 'react';
import { useAuth, ROLE_META } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onSwitchToRegister, onBack }) {
  const { login, DEMO_USERS } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const isLight = theme === 'light';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  const fillDemo = (demoUser) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setSelectedDemo(demoUser.id);
    setError('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', fontFamily: "'DM Sans',sans-serif", flexWrap: 'wrap' }}>
      {/* Left — branding */}
      <div className='login-panel-left' style={{ width: '52%', background: 'linear-gradient(160deg,#080e1a,#0d1f35,#0a3d2e)', padding: '48px 52px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle,rgba(24,174,148,0.12),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.08),transparent 70%)', pointerEvents: 'none' }} />
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#18ae94,#0e7a66)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 700, boxShadow: '0 0 20px rgba(24,174,148,0.45)' }}>⚕</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 17, color: '#fff' }}>MediCore</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: 2.5, textTransform: 'uppercase' }}>HMS v2.0</div>
          </div>
        </div>
        {/* Hero */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: 'rgba(24,174,148,0.15)', border: '1px solid rgba(24,174,148,0.3)', borderRadius: 16, fontSize: 11, color: '#18ae94', fontWeight: 600, marginBottom: 18, width: 'fit-content' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#18ae94', display: 'inline-block' }} /> NABH Accredited
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 14 }}>
            Seamless care,<br />
            <span style={{ background: 'linear-gradient(135deg,#18ae94,#70e0c8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>unified management.</span>
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 380, marginBottom: 32 }}>
            Manage patients, staff, billing, pharmacy and more — all from one powerful dashboard built for modern hospitals.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
            {['Role-based Access','Real-time Alerts','Patient Records','Billing','Lab Management','Pharmacy Stock'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                <span style={{ color: '#18ae94' }}>✓</span> {f}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24 }}>
            {[['1,284','Patients'],['46','Today\'s Appts'],['250+','Beds']].map(([v,l]) => (
              <div key={l}><div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 22, background: 'linear-gradient(135deg,#18ae94,#70e0c8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{v}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{l}</div></div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>© 2026 MediCore Hospital</div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', overflowY: 'auto', background: 'var(--bg)', minWidth: 280 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            {onBack && <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>← Home</button>}
            <button onClick={toggleTheme} style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--surface2)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>{isLight ? '🌙' : '☀️'}</button>
          </div>

          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Welcome back</h2>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24 }}>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Email */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1.2, display: 'block', marginBottom: 6 }}>Email Address</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--input-bg)', border: `1px solid ${error ? '#ef4444' : 'var(--border)'}`, borderRadius: 12, padding: '0 14px', height: 44, transition: 'all 0.2s' }}>
                <svg width="16" height="16" fill="none" stroke="var(--text3)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => { setEmail(e.target.value); setError(''); }} 
                  placeholder="your@medicore.in" 
                  required 
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)' }} 
                />
              </div>
            </div>
            {/* Password */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1.2, display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--input-bg)', border: `1px solid ${error ? '#ef4444' : 'var(--border)'}`, borderRadius: 12, padding: '0 14px', height: 44, transition: 'all 0.2s' }}>
                <svg width="16" height="16" fill="none" stroke="var(--text3)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <input 
                  type={showPass ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => { setPassword(e.target.value); setError(''); }} 
                  placeholder="••••••••" 
                  required 
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)' }} 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 14, padding: 0 }}>{showPass ? '🙈' : '👁'}</button>
              </div>
            </div>

            {error && <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, fontSize: 12, color: '#ef4444' }}>⚠ {error}</div>}

            <button type="submit" disabled={loading} style={{ padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: '#18ae94', color: '#fff', border: 'none', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.8 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 0 20px rgba(24,174,148,0.35)', transition: 'all 0.2s' }}>
              {loading ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" style={{ animation: 'spin 1s linear infinite' }}><circle cx="12" cy="12" r="9" strokeOpacity="0.3"/><path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round"/></svg> Signing in…</> : 'Sign In →'}
            </button>
          </form>

          {/* Demo logins */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>Quick demo login</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {DEMO_USERS && DEMO_USERS.filter(u => u.approved !== false).map(u => {
                const m = ROLE_META[u.role];
                return (
                  <button 
                    key={u.id} 
                    type="button" 
                    onClick={() => fillDemo(u)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 10, 
                      padding: 10, 
                      borderRadius: 12, 
                      border: selectedDemo === u.id ? '1.5px solid rgba(24,174,148,0.5)' : '1px solid var(--border)', 
                      background: selectedDemo === u.id ? 'rgba(24,174,148,0.1)' : 'var(--surface2)', 
                      cursor: 'pointer', 
                      transition: 'all 0.15s', 
                      textAlign: 'left' 
                    }}
                  >
                    <div style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: 10, 
                      background: `linear-gradient(135deg, ${u.avatarColor || '#18ae94,#0e7a66'})`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#fff', 
                      fontSize: 10, 
                      fontWeight: 700, 
                      flexShrink: 0 
                    }}>
                      {u.avatar}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {u.name.replace('Dr. Admin ', 'Admin ')}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#18ae94' }}>
                        {m?.icon} {m?.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text2)' }}>
            New staff member?{' '}
            <button onClick={onSwitchToRegister} style={{ background: 'none', border: 'none', color: '#18ae94', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
              Register →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
}