import React, { useState } from 'react';
import { useAuth, ROLE_META, ALL_MODULES, MODULE_LABELS, DEFAULT_ROLE_PERMISSIONS } from '../../context/AuthContext';
import { Avatar } from '../../components/common';

const ACTIONS = ['view', 'create', 'edit', 'delete'];
const ACTION_COLORS = {
  view:   'text-brand-400 border-brand-500/30',
  create: 'text-emerald-400 border-emerald-500/30',
  edit:   'text-amber-400 border-amber-500/30',
  delete: 'text-red-400 border-red-500/30',
};

function PermToggle({ checked, onChange, action }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-150 text-xs font-bold
        ${checked
          ? `bg-current/15 ${ACTION_COLORS[action]} ${checked ? 'opacity-100' : 'opacity-40'}`
          : 'border-slate-700 bg-slate-800/50 text-slate-600 hover:border-slate-600'
        }`}
    >
      {checked ? '✓' : '—'}
    </button>
  );
}

export default function PermissionsPage() {
  const { getPermissions, setUserPermissions, resetUserPermissions, hasCustomPermissions ,ALL_USERS } = useAuth();
  const manageable = (ALL_USERS || []).filter(u => u.role !== 'admin');
  const [selectedUser, setSelectedUser] = useState(() => manageable[0] || null);
  const [saved, setSaved] = useState(false);

  if (!selectedUser) return <div className="p-10 text-center" style={{ color: 'var(--text2)' }}>No staff users found.</div>;

  const perms = getPermissions(selectedUser.id);

  const toggle = (module, action) => {
    setUserPermissions(selectedUser.id, module, { [action]: !perms[module]?.[action] });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    resetUserPermissions(selectedUser.id);
    setSaved(false);
  };

  const meta = ROLE_META[selectedUser.role];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-100">Access Permissions</h2>
          <p className="text-xs text-slate-500 mt-0.5">Grant or revoke module access for individual staff members</p>
        </div>
        <div className="flex gap-2">
          {hasCustomPermissions(selectedUser.id) && (
            <button onClick={handleReset} className="btn btn-danger btn-sm">↩ Reset to Role Defaults</button>
          )}
          <button onClick={handleSave} className={`btn btn-sm ${saved ? 'btn-success' : 'btn-primary'}`}>
            {saved ? '✓ Saved!' : '💾 Save Permissions'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* User selector */}
        <div className="xl:col-span-1">
          <div className="hms-card p-2">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Staff Members</div>
            {manageable.map(u => {
              const m = ROLE_META[u.role];
              const hasCustom = hasCustomPermissions(u.id);
              return (
                <div
                  key={u.id}
                  onClick={() => { setSelectedUser(u); setSaved(false); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 mb-0.5
                    ${selectedUser.id === u.id ? 'bg-brand-500/10 border border-brand-500/25' : 'hover:bg-slate-800'}`}
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${u.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {u.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-200 truncate">{u.name}</div>
                    <div className={`text-[10px] font-semibold ${m.color.split(' ')[0]}`}>{m.icon} {m.label}</div>
                  </div>
                  {hasCustom && (
                    <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" title="Custom permissions" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Permission matrix */}
        <div className="xl:col-span-3 hms-card">
          {/* Selected user header */}
          <div className="card-header">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${selectedUser.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
                {selectedUser.avatar}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-200">{selectedUser.name}</div>
                <div className={`text-xs font-semibold ${meta.color.split(' ')[0]}`}>{meta.icon} {meta.label} · {selectedUser.dept}</div>
              </div>
              {hasCustomPermissions(selectedUser.id) && (
                <span className="badge bg-amber-500/15 text-amber-400 border border-amber-500/30 ml-2">Custom Overrides Active</span>
              )}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-3 text-[10px] font-semibold">
              {ACTIONS.map(a => (
                <div key={a} className={`flex items-center gap-1 ${ACTION_COLORS[a].split(' ')[0]}`}>
                  <div className={`w-2.5 h-2.5 rounded border ${ACTION_COLORS[a].split(' ')[1]}`} />
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-5 py-3 w-48">Module</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 py-3" colSpan={4}>Permissions</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 py-3">All</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 py-3">Default</th>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <th className="px-5 py-2" />
                  {ACTIONS.map(a => (
                    <th key={a} className={`text-center text-[10px] font-bold px-3 py-2 ${ACTION_COLORS[a].split(' ')[0]}`}>
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </th>
                  ))}
                  <th className="px-3 py-2" />
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {ALL_MODULES.map(mod => {
                  const roleDef = DEFAULT_ROLE_PERMISSIONS[selectedUser.role]?.[mod] || {};
                  const allOn = ACTIONS.every(a => perms[mod]?.[a]);
                  const toggleAll = () => {
                    ACTIONS.forEach(a => setUserPermissions(selectedUser.id, mod, { [a]: !allOn }));
                    setSaved(false);
                  };
                  const resetMod = () => {
                    setUserPermissions(selectedUser.id, mod, { ...roleDef });
                    setSaved(false);
                  };

                  return (
                    <tr key={mod} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base
                            ${perms[mod]?.view ? 'bg-slate-800' : 'bg-slate-900 opacity-50'}`}>
                            {mod === 'dashboard' ? '⊞' : mod === 'patients' ? '👥' : mod === 'doctors' ? '🩺' :
                             mod === 'appointments' ? '📅' : mod === 'billing' ? '💳' : mod === 'pharmacy' ? '💊' :
                             mod === 'lab' ? '🔬' : mod === 'staff' ? '👔' : '⚙️'}
                          </div>
                          <span className={`text-sm font-semibold ${perms[mod]?.view ? 'text-slate-200' : 'text-slate-500'}`}>
                            {MODULE_LABELS[mod]}
                          </span>
                        </div>
                      </td>
                      {ACTIONS.map(action => (
                        <td key={action} className="text-center px-3 py-3.5">
                          <div className="flex justify-center">
                            <PermToggle
                              checked={!!perms[mod]?.[action]}
                              onChange={() => toggle(mod, action)}
                              action={action}
                            />
                          </div>
                        </td>
                      ))}
                      {/* Toggle all */}
                      <td className="text-center px-3 py-3.5">
                        <button
                          onClick={toggleAll}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all
                            ${allOn ? 'text-red-400 border-red-500/30 bg-red-500/10 hover:bg-red-500/20' : 'text-brand-400 border-brand-500/30 bg-brand-500/10 hover:bg-brand-500/20'}`}
                        >
                          {allOn ? 'None' : 'All'}
                        </button>
                      </td>
                      {/* Reset to default */}
                      <td className="text-center px-3 py-3.5">
                        <button
                          onClick={resetMod}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-600 text-slate-400 hover:bg-slate-700 transition-all"
                          title="Reset to role default"
                        >
                          ↩
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom note */}
          <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/30 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              💡 Changes override the user's default role permissions. Use "Reset to Role Defaults" to undo all custom changes.
            </span>
            <button onClick={handleSave} className={`btn btn-sm ${saved ? 'btn-success' : 'btn-primary'}`}>
              {saved ? '✓ Saved!' : '💾 Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
