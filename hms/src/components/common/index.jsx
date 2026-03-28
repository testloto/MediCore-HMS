import React from 'react';

export function Badge({ status, children }) {
  const s = (children || status || '').toString().toLowerCase();
  const map = { active:'badge-active', critical:'badge-critical', discharged:'badge-discharged', pending:'badge-pending', scheduled:'badge-scheduled', paid:'badge-paid', unpaid:'badge-unpaid', morning:'badge-morning', evening:'badge-evening', night:'badge-night', available:'badge-available', busy:'badge-busy', 'off-duty':'badge-discharged', normal:'badge-active', abnormal:'badge-critical', borderline:'badge-pending', completed:'badge-completed', cancelled:'badge-cancelled', inactive:'badge-inactive' };
  return <span className={`badge ${map[s] || 'badge'}`} style={!map[s]?{background:'var(--surface3)',color:'var(--text2)'}:{}}>{children || status}</span>;
}

const AV_COLORS = ['bg-brand-500/30 text-brand-300','bg-purple-500/30 text-purple-300','bg-blue-500/30 text-blue-300','bg-pink-500/30 text-pink-300','bg-amber-500/30 text-amber-300','bg-cyan-500/30 text-cyan-300','bg-red-500/30 text-red-300'];
export function Avatar({ name='?', size='sm', color }) {
  const cls = color ? '' : AV_COLORS[(name||'?').charCodeAt(0) % AV_COLORS.length];
  return <div className={`avatar avatar-${size} ${cls}`} style={color?{background:color+'33',color}:{}}>{(name||'?')[0]?.toUpperCase()}</div>;
}

export function Modal({ title, onClose, children, footer, size='md' }) {
  const w = { sm:'360px', md:'520px', lg:'680px', xl:'820px' }[size];
  React.useEffect(() => { document.body.style.overflow='hidden'; return ()=>{ document.body.style.overflow=''; }; }, []);
  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth:w }}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="btn-icon" onClick={onClose}><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ icon='📭', title='No data', desc='' }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 20px', textAlign:'center' }}>
      <div style={{ fontSize:38, marginBottom:12 }}>{icon}</div>
      <div style={{ fontWeight:600, fontSize:14, color:'var(--text)' }}>{title}</div>
      {desc && <div style={{ fontSize:12, color:'var(--text3)', marginTop:6, maxWidth:280 }}>{desc}</div>}
    </div>
  );
}

export function Loader() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'60px 0' }}>
      <div style={{ width:30, height:30, border:'2px solid var(--brand)', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder='Search…' }) {
  return (
    <div className="search-wrap">
      <svg width="14" height="14" fill="none" stroke="var(--text3)" viewBox="0 0 24 24" style={{ flexShrink:0 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function StatCard({ label, value, icon, change, changeDir='up', type='teal', index=0 }) {
  const s = ['animate-stagger-1','animate-stagger-2','animate-stagger-3','animate-stagger-4'];
  const ic = { teal:'bg-brand-500/20 text-brand-400', blue:'bg-blue-500/20 text-blue-400', red:'bg-red-500/20 text-red-400', amber:'bg-amber-500/20 text-amber-400', purple:'bg-purple-500/20 text-purple-400' };
  return (
    <div className={`stat-card ${type} ${s[index%4]}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 ${ic[type]||ic.teal}`}>{icon}</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:'var(--text)', letterSpacing:'-0.02em' }}>{value}</div>
      <div style={{ fontSize:11, color:'var(--text2)', marginTop:3, fontWeight:500 }}>{label}</div>
      {change && <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, marginTop:6, fontWeight:600, color:changeDir==='up'?'#34d399':'#f87171' }}><span>{changeDir==='up'?'↑':'↓'}</span><span>{change}</span></div>}
    </div>
  );
}

export function ProgressBar({ value, max=100, color='#18ae94', label, sublabel }) {
  const pct = Math.min(100, Math.round((value/max)*100));
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      {label && <div style={{ fontSize:11, color:'var(--text2)', width:76, flexShrink:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{label}</div>}
      <div className="progress-track"><div className="progress-fill" style={{ width:`${pct}%`, background:color }} /></div>
      <div style={{ fontSize:11, fontWeight:600, width:42, textAlign:'right', color, flexShrink:0 }}>{sublabel!==undefined?sublabel:`${pct}%`}</div>
    </div>
  );
}

export function Card({ title, action, onAction, children, className='' }) {
  return (
    <div className={`hms-card ${className}`}>
      {title && (
        <div className="card-header">
          <span className="card-title">{title}</span>
          {action && <button onClick={onAction} style={{ fontSize:12, color:'var(--brand)', fontWeight:600, background:'none', border:'none', cursor:'pointer' }}>{action}</button>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tab-bar">
      {tabs.map(t => (
        <div key={t.id} className={`tab-item${active===t.id?' active':''}`} onClick={()=>onChange(t.id)}>
          {t.icon && <span style={{ marginRight:5 }}>{t.icon}</span>}{t.label}
        </div>
      ))}
    </div>
  );
}

export function Divider() { return <div style={{ borderTop:'1px solid var(--border)', margin:'14px 0' }} />; }

export function Field({ label, children }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      {children}
    </div>
  );
}

export function Toggle({ label, desc, checked, onChange }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 0', borderBottom:'1px solid var(--border)', gap:16 }}>
      <div style={{ minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{label}</div>
        {desc && <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{desc}</div>}
      </div>
      <button onClick={()=>onChange?.(!checked)} style={{ width:42, height:22, borderRadius:11, border:'none', cursor:'pointer', flexShrink:0, background:checked?'var(--brand)':'var(--surface3)', transition:'background 0.2s', position:'relative' }}>
        <span style={{ position:'absolute', top:2, left:checked?22:2, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }} />
      </button>
    </div>
  );
}
