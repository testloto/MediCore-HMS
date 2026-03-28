import React, { useState } from 'react';
import { Field, Card, Divider, Toggle } from '../../components/common';
import { useAuth, ROLE_META } from '../../context/AuthContext';

export default function Settings({ setPage }) {
  const { user, PENDING_USERS, approveUser, rejectUser } = useAuth();
  const [activeTab, setActiveTab] = useState('hospital');
  const [approveRole, setApproveRole] = useState({});
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleApprove = (uid) => {
    const role = approveRole[uid] || 'receptionist';
    approveUser(uid, role);
    showToast(`✅ User approved as ${role}`);
  };

  const tabs = [
    { id: 'hospital',    label: '🏥 Hospital' },
    { id: 'profile',     label: '👤 Profile' },
    { id: 'roles',       label: '🔒 Roles' },
    { id: 'system',      label: '⚙️ System' },
    { id: 'appearance',  label: '🎨 Appearance' },
    ...(user?.role === 'admin' && PENDING_USERS?.length > 0 ? [{ id: 'pending', label: `⏳ Pending (${PENDING_USERS.length})` }] : []),
  ];

  return (
    <div>
      {toast && <div className="fixed top-20 right-6 z-[999] bg-slate-800 border border-slate-600 text-slate-200 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-up">{toast}</div>}
      <div className="settings-wrap">
        {/* Sidebar tabs */}
        <div className="settings-sidebar">
          <div className="hms-card p-2">
            {tabs.map(t => (
              <div
                key={t.id}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-150`}
                style={{ background: activeTab === t.id ? 'rgba(24,174,148,0.12)' : 'transparent', color: activeTab === t.id ? '#18ae94' : 'var(--text2)', borderLeft: activeTab === t.id ? '2px solid #18ae94' : '2px solid transparent' }}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </div>
            ))}
            {user?.role === 'admin' && (
              <>
                <div className="hms-divider" />
                <div
                  className="px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-150"
                  style={{ color: '#f59e0b' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => setPage && setPage('permissions')}
                >
                  🔐 Manage Access
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'hospital' && (
            <div className="hms-card">
              <div className="card-header">
                <span className="card-title">Hospital Information</span>
                <button className="btn btn-primary btn-sm">💾 Save Changes</button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6 p-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-3xl shadow-glow-teal flex-shrink-0">⚕</div>
                  <div>
                    <div className="font-display text-lg font-semibold text-slate-100">MediCore Hospital</div>
                    <div className="text-xs text-brand-400 mt-0.5">NABH Accredited · Multi-speciality</div>
                    <div className="text-xs text-slate-500 mt-1">Established 2010 · Mumbai, Maharashtra</div>
                  </div>
                  <button className="btn btn-secondary btn-sm ml-auto">Change Logo</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['Hospital Name', 'MediCore Hospital'],
                    ['Registration No.', 'MH/HOS/2010/4521'],
                    ['Contact Number', '022-4455-6677'],
                    ['Emergency Line', '022-4455-0000'],
                    ['Email Address', 'admin@medicore.in'],
                    ['Website', 'www.medicore.in'],
                    ['Address Line 1', 'Bandra West'],
                    ['City', 'Mumbai'],
                    ['State', 'Maharashtra'],
                    ['Pincode', '400050'],
                    ['Beds Capacity', '250'],
                    ['Accreditation', 'NABH, ISO 9001:2015'],
                  ].map(([label, val]) => (
                    <Field key={label} label={label}>
                      <input className="form-input" defaultValue={val} />
                    </Field>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="hms-card">
              <div className="card-header">
                <span className="card-title">Profile Settings</span>
                <button className="btn btn-primary btn-sm">🔐 Update</button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 p-5 rounded-2xl mb-6" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${user?.avatarColor || 'from-purple-500 to-indigo-600'} flex items-center justify-center text-2xl font-bold text-white flex-shrink-0`}>{user?.avatar || 'A'}</div>
                  <div>
                    <div className="font-semibold text-lg" style={{ color: 'var(--text)' }}>{user?.name || 'Admin User'}</div>
                    <div className="text-sm text-brand-400">{user?.role === 'admin' ? 'System Administrator' : user?.role}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text3)' }}>{user?.email} · Last login: {user?.lastLogin}</div>
                  </div>
                  <button className="btn btn-secondary btn-sm ml-auto">Change Photo</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Full Name"><input className="form-input" defaultValue="Dr. Admin User" /></Field>
                  <Field label="Employee ID"><input className="form-input opacity-50" defaultValue="ADM-001" disabled /></Field>
                  <Field label="Email"><input type="email" className="form-input" defaultValue="admin@medicore.in" /></Field>
                  <Field label="Phone"><input className="form-input" defaultValue="98765 00001" /></Field>
                  <Field label="Department"><select className="form-input"><option>Administration</option><option>Medical</option></select></Field>
                  <Field label="Role"><select className="form-input"><option>Super Admin</option></select></Field>
                </div>
                <Divider />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Current Password"><input type="password" className="form-input" placeholder="••••••••" /></Field>
                  <Field label="New Password"><input type="password" className="form-input" placeholder="New password" /></Field>
                  <Field label="Confirm Password"><input type="password" className="form-input" placeholder="Confirm new password" /></Field>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="hms-card">
              <div className="card-header"><span className="card-title">Roles & Permissions</span></div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="hms-table">
                    <thead>
                      <tr>
                        <th>Role</th>
                        {['Dashboard','Patients','Doctors','Appointments','Billing','Pharmacy','Lab','Staff','Settings'].map(m => (
                          <th key={m} className="text-center">{m}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { role: 'Super Admin', color: 'text-brand-400', perms: [true,true,true,true,true,true,true,true,true] },
                        { role: 'Doctor',      color: 'text-blue-400',  perms: [true,true,true,true,false,true,true,false,false] },
                        { role: 'Nurse',       color: 'text-purple-400',perms: [true,true,false,true,false,true,true,false,false] },
                        { role: 'Receptionist',color: 'text-amber-400', perms: [true,true,false,true,true,false,false,false,false] },
                        { role: 'Patient',     color: 'text-slate-400', perms: [false,false,false,true,true,false,true,false,false] },
                      ].map(r => (
                        <tr key={r.role}>
                          <td className={`font-semibold ${r.color}`}>{r.role}</td>
                          {r.perms.map((p, i) => (
                            <td key={i} className="text-center">
                              <input type="checkbox" defaultChecked={p} className="accent-brand-500 w-3.5 h-3.5" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="btn btn-primary">Save Permissions</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="hms-card">
              <div className="card-header"><span className="card-title">System Preferences</span></div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-0">
                  <Toggle label="Email Notifications" desc="Send system alerts and reports via email" checked={true} />
                  <Toggle label="SMS Alerts" desc="Send critical patient alerts via SMS" checked={false} />
                  <Toggle label="Automated Backups" desc="Daily backup at 2:00 AM" checked={true} />
                  <Toggle label="Audit Logs" desc="Log all user activity for compliance" checked={true} />
                  <Toggle label="Two-Factor Authentication" desc="Require 2FA for all admin logins" checked={false} />
                  <Toggle label="Session Timeout" desc="Auto logout after 30 min of inactivity" checked={true} />
                  <Toggle label="Maintenance Mode" desc="Temporarily disable user access" checked={false} />
                </div>
                <Divider />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Backup Frequency">
                    <select className="form-input"><option>Daily</option><option>Weekly</option><option>Monthly</option></select>
                  </Field>
                  <Field label="Session Timeout (min)">
                    <input type="number" className="form-input" defaultValue={30} />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="hms-card">
              <div className="card-header"><span className="card-title">Appearance</span></div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="form-label mb-3">Theme</div>
                  <div className="grid grid-cols-3 gap-3">
                    {[['Dark','bg-slate-900'],['Darker','bg-slate-950'],['Light','bg-gray-100']].map(([label, bg], i) => (
                      <div key={label} className={`rounded-xl p-3 border-2 cursor-pointer transition-all ${i===0 ? 'border-brand-500 bg-brand-500/10' : ''}`}
                        style={{ borderColor: i!==0 ? 'var(--border)' : undefined }}>
                        <div className={`h-12 rounded-lg mb-2 ${bg}`} />
                        <div className="text-xs font-medium text-center" style={{ color: 'var(--text)' }}>{label}</div>
                        {i===0 && <div className="text-[10px] text-brand-400 text-center mt-0.5">Active</div>}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="form-label mb-3">Accent Color</div>
                  <div className="flex gap-2">
                    {['#18ae94','#3b82f6','#8b5cf6','#ec4899','#f59e0b','#ef4444'].map(c => (
                      <div key={c} className={`w-8 h-8 rounded-lg cursor-pointer transition-transform hover:scale-110 border-2 ${c==='#18ae94'?'border-white':'border-transparent'}`}
                        style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="form-label mb-3">Font Size</div>
                  <div className="tab-bar w-fit">
                    {['Small','Medium','Large'].map((s,i) => (
                      <div key={s} className={`tab-item ${i===1?'active':''}`}>{s}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PENDING APPROVALS ── */}
          {activeTab === 'pending' && (
            <div className="hms-card">
              <div className="card-header">
                <span className="card-title">⏳ Pending Registration Requests</span>
                <span className="badge bg-amber-500/15 text-amber-400 border border-amber-500/30">{PENDING_USERS?.length || 0} pending</span>
              </div>
              {(!PENDING_USERS || PENDING_USERS.length === 0) ? (
                <div className="flex flex-col items-center py-16" style={{ color: 'var(--text2)' }}>
                  <div className="text-4xl mb-3">✅</div>
                  <div className="font-semibold text-sm">No pending requests</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text3)' }}>All registration requests have been processed</div>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {PENDING_USERS.map(u => (
                    <div key={u.id} className="flex items-center gap-4 px-5 py-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${u.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {u.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{u.name}</div>
                        <div className="text-xs" style={{ color: 'var(--text2)' }}>{u.email} · {u.dept}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>Registered: {u.joined}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={approveRole[u.id] || 'receptionist'}
                          onChange={e => setApproveRole(prev => ({ ...prev, [u.id]: e.target.value }))}
                          className="form-input text-xs w-36"
                        >
                          {['doctor','nurse','receptionist','pharmacist','lab_technician'].map(r => (
                            <option key={r} value={r}>{r.replace('_',' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                          ))}
                        </select>
                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(u.id)}>✓ Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => { rejectUser(u.id); showToast('❌ Request rejected'); }}>✕ Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
