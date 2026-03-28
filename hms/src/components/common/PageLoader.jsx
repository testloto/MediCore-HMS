import React from 'react';

export default function PageLoader({ fullscreen = false }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: fullscreen ? '100vh' : '60vh', background: 'var(--bg)',
    }}>
      {/* Spinner */}
      <div style={{ position: 'relative', width: 52, height: 52, marginBottom: 16 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '3px solid var(--border)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '3px solid transparent', borderTopColor: '#18ae94',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 8, borderRadius: '50%',
          border: '2px solid transparent', borderTopColor: 'rgba(24,174,148,0.35)',
          animation: 'spin 1.4s linear infinite reverse',
        }} />
        <div style={{
          position: 'absolute', inset: '50%', transform: 'translate(-50%,-50%)',
          width: 10, height: 10, borderRadius: '50%',
          background: '#18ae94', opacity: 0.7,
        }} />
      </div>
      <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Loading…</div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
