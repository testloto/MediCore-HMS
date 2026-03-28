import React from 'react';

export default function AccessDenied({ page, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 animate-fade-in">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6"
        style={{ background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.2)' }}>
        🔒
      </div>
      <h2 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Access Restricted</h2>
      <p className="text-sm text-center max-w-sm mb-2" style={{ color: 'var(--text2)' }}>
        You don't have permission to view <span className="font-semibold" style={{ color: 'var(--text)' }}>{page}</span>.
      </p>
      <p className="text-xs text-center max-w-sm mb-8" style={{ color: 'var(--text3)' }}>
        Contact your system administrator to request access to this module.
      </p>
      <button onClick={onBack} className="btn btn-secondary">← Back to Dashboard</button>
    </div>
  );
}
