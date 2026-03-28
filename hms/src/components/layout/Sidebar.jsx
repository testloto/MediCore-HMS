import React from 'react';
import { useAuth, ROLE_META } from '../../context/AuthContext';

const NAV = [
  {
    section: 'Core',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        Icon: () => (
          <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
            <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
            <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
            <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
          </svg>
        ),
      },
      {
        id: 'patients',
        label: 'Patients',
        badge: 3,
        Icon: () => (
          <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        ),
      },
      {
        id: 'doctors',
        label: 'Doctors',
        Icon: () => (
          <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        ),
      },
      {
        id: 'appointments',
        label: 'Appointments',
        badge: 2,
        Icon: () => (
          <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/>
            <path strokeLinecap="round" strokeWidth="2" d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
        ),
      },
    ],
  },

  {
    section: 'Operations',
    items: [
      {
        id: 'billing',
        label: 'Billing',
        Icon: () => (
          <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="1" y="4" width="22" height="16" rx="2" strokeWidth="2"/>
            <path strokeLinecap="round" strokeWidth="2" d="M1 10h22"/>
          </svg>
        ),
      },
      {
        id: 'pharmacy',
        label: 'Pharmacy',
        badge: 1,
        Icon: () => (
          <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/>
          </svg>
        ),
      },
      {
        id: 'lab',
        label: 'Laboratory',
        Icon: () => (
          <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v11a6 6 0 006 6 6 6 0 006-6V3M9 3H7M9 3h6m0 0h2"/>
          </svg>
        ),
      },
    ],
  },

  {
    section: 'Admin',
    items: [
      {
        id: 'staff',
        label: 'Staff',
        Icon: () => (
          <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        ),
      },

      /* ⭐ PERFECTLY MATCHED Pending Users Icon (Feather Style) */
      {
        id: 'pending',
        label: 'Pending Users',
        adminOnly: true,
        Icon: () => (
          <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2"/>
          </svg>
        ),
      },

      {
        id: 'settings',
        label: 'Settings',
        Icon: () => (
          <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <circle cx="12" cy="12" r="3" strokeWidth="2"/>
          </svg>
        ),
      },

      {
        id: 'permissions',
        label: 'Permissions',
        adminOnly: true,
        Icon: () => (
          <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar({ active, onNavigate, isOpen }) {
  const { user, logout, can, PENDING_USERS } = useAuth();
  const meta = user ? ROLE_META[user.role] : null;
  const pending = PENDING_USERS?.length || 0;

  const visible = (item) => {
  if (item.adminOnly) return user?.role === "admin";
  if (typeof can !== "function") return true;
  return can(item.id, "view");
};

  return (
    <aside className={`hms-sidebar${isOpen ? ' open' : ''}`}>

      {/* Logo Row */}
      <div style={{
        display:'flex',
        alignItems:'center',
        gap:12,
        padding:'18px 18px 14px',
        borderBottom:'1px solid var(--border)',
        flexShrink:0
      }}>
        <div style={{
          width:36, height:36, borderRadius:10,
          background:'linear-gradient(135deg,#18ae94,#0e7a66)',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#fff', fontSize:18, fontWeight:700,
          boxShadow:'0 0 14px rgba(24,174,148,0.4)',
          flexShrink:0
        }}>⚕</div>

        <div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:'var(--text)' }}>MediCore</div>
          <div style={{ fontSize:9, color:'var(--text3)', letterSpacing:'2.5px', textTransform:'uppercase' }}>HMS v2.0</div>
        </div>
      </div>

      {/* Role Badge */}
      {meta && (
        <div style={{ padding:'8px 16px', borderBottom:'1px solid var(--border)' }}>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold ${meta.color}`}>
            {meta.icon} {meta.label}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex:1, overflowY:'auto', padding:'8px 0' }} className="scrollbar-none">
        {NAV.map(group => {
          const items = group.items.filter(visible);
          if (!items.length) return null;

          return (
            <div key={group.section} style={{ marginBottom:6 }}>
              <div style={{
                padding:'4px 20px 2px',
                fontSize:9,
                fontWeight:700,
                letterSpacing:'2px',
                textTransform:'uppercase',
                color:'var(--text3)'
              }}>{group.section}</div>

              {items.map(item => {
                const isActive = active === item.id;

                const badgeValue =
                  item.id === 'pending' ? pending : item.badge;

                return (
                  <div
                    key={item.id}
                    className={`sidebar-item${isActive ? ' active' : ''}`}
                    onClick={() => onNavigate(item.id)}
                  >
                    <span style={{ opacity:0.8 }}>
                      <item.Icon />
                    </span>

                    <span style={{ flex:1 }}>{item.label}</span>

                    {badgeValue > 0 && (
                      <span style={{
                        fontSize:10,
                        fontWeight:700,
                        background:'#ef4444',
                        color:'#fff',
                        width:17,
                        height:17,
                        borderRadius:'50%',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center'
                      }}>
                        {badgeValue}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div style={{
        padding:'10px 14px',
        borderTop:'1px solid var(--border)',
        flexShrink:0,
        display:'flex',
        flexDirection:'column',
        gap:6
      }}>

        {user && (
          <div style={{
            display:'flex',
            alignItems:'center',
            gap:10,
            padding:'8px 10px',
            borderRadius:12,
            background:'var(--surface2)',
            border:'1px solid var(--border)'
          }}>
            <div className={`avatar avatar-sm bg-gradient-to-br ${user.avatarColor} text-white`}>
              {user.avatar}
            </div>

            <div style={{ flex:1 }}>
              <div style={{
                fontSize:12,
                fontWeight:600,
                color:'var(--text)',
                overflow:'hidden',
                textOverflow:'ellipsis',
                whiteSpace:'nowrap'
              }}>{user.name}</div>

              <div style={{
                fontSize:10,
                color:'var(--text3)'
              }}>{user.dept}</div>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          style={{
            padding:'8px 10px',
            borderRadius:12,
            fontSize:12,
            fontWeight:500,
            color:'#ef4444',
            background:'transparent',
            border:'1px solid transparent',
            cursor:'pointer'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}