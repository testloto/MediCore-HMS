import React, { memo, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard, Card, Badge, ProgressBar, Avatar } from '../../components/common';
import { REVENUE_DATA, WARD_DATA, PATIENTS, DOCTORS } from '../../data/mockData';
import { patientService } from '../../services/patientService';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';

const CustomTooltip = memo(({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, fontSize: 12, boxShadow: 'var(--card-shadow)' }}>
      <div style={{ color: 'var(--text2)', marginBottom: 4, fontWeight: 500 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'var(--text2)', textTransform: 'capitalize' }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: 'var(--text)' }}>
            {typeof p.value === 'number' && p.value > 1000 ? `₹${(p.value / 1000).toFixed(0)}K` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
});
CustomTooltip.displayName = 'CustomTooltip';

export default memo(function Dashboard({ setPage }) {
  const [stats, setStats] = useState({ total: 0, active: 0, critical: 0, discharged: 0, admittedToday: 0 });
  const [todayAppts, setTodayAppts] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo fallback data
    const DEMO_STATS = { total: 1284, active: 300, critical: 12, discharged: 980, admittedToday: 10 };
    const DEMO_APPTS = [
      { id: 1, time: '09:00', patient: 'John Doe', doctor: 'Dr. Smith', status: 'pending' },
      { id: 2, time: '10:00', patient: 'Jane Roe', doctor: 'Dr. Brown', status: 'completed' },
      { id: 3, time: '11:30', patient: 'Mike Johnson', doctor: 'Dr. Wilson', status: 'confirmed' },
      { id: 4, time: '14:00', patient: 'Sarah Lee', doctor: 'Dr. Davis', status: 'pending' },
      { id: 5, time: '15:30', patient: 'Tom Brown', doctor: 'Dr. Smith', status: 'completed' },
    ];

    // Load all patients to calculate stats (since getDashboardStats doesn't exist)
    const loadPatientStats = async () => {
      try {
        const response = await patientService.getAll();
        if (response.data?.success && response.data.data) {
          const patients = response.data.data;
          // Calculate stats from actual data
          setStats({
            total: patients.length,
            active: patients.filter(p => p.status === 'active' || p.status === 'ACTIVE').length,
            critical: patients.filter(p => p.critical === true || p.priority === 'CRITICAL').length,
            discharged: patients.filter(p => p.status === 'discharged' || p.status === 'DISCHARGED').length,
            admittedToday: patients.filter(p => {
              const today = new Date().toDateString();
              return new Date(p.admissionDate || p.createdAt).toDateString() === today;
            }).length
          });
        } else {
          setStats(DEMO_STATS);
        }
      } catch (err) {
        console.warn('Failed to load patient stats:', err);
        setStats(DEMO_STATS);
      }
    };

    // Load today's appointments
    const loadTodayAppointments = async () => {
      try {
        const response = await appointmentService.getToday();
        if (response.data?.success && response.data.data) {
          const appointments = response.data.data.map(apt => ({
            id: apt.id,
            time: apt.appointmentTime || apt.time || '--:--',
            patient: apt.patientName || apt.patient || 'Unknown',
            doctor: apt.doctorName || apt.doctor || 'Unknown',
            status: apt.status?.toLowerCase() || 'pending'
          }));
          setTodayAppts(appointments.slice(0, 5));
        } else {
          setTodayAppts(DEMO_APPTS);
        }
      } catch (err) {
        console.warn('Failed to load today appointments:', err);
        setTodayAppts(DEMO_APPTS);
      }
    };

    // Load doctors
    const loadDoctors = async () => {
      try {
        const response = await doctorService.getAll();
        if (response.data?.success && response.data.data) {
          setTopDoctors(response.data.data.slice(0, 5));
        } else {
          setTopDoctors(DOCTORS);
        }
      } catch (err) {
        console.warn('Failed to load doctors:', err);
        setTopDoctors(DOCTORS);
      } finally {
        setLoading(false);
      }
    };

    // Execute all API calls
    Promise.all([loadPatientStats(), loadTodayAppointments(), loadDoctors()]);
  }, []);

  const criticalPts = stats.critical || 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <div style={{ color: 'var(--text2)' }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats row — 2 cols on mobile, 4 on xl */}
      <div className="grid-stats mb-5">
        <StatCard label="Total Patients" value={stats.total.toLocaleString()} icon="👥" change="+12%" changeDir="up" type="teal" index={0} />
        <StatCard label="Appointments Today" value={todayAppts.length} icon="📅" change="+5%" changeDir="up" type="blue" index={1} />
        <StatCard label="Critical Patients" value={criticalPts} icon="🚨" change="−2 yesterday" changeDir="down" type="red" index={2} />
        <StatCard label="Revenue" value="₹4.21L" icon="💰" change="+18%" changeDir="up" type="amber" index={3} />
      </div>

      {/* Chart + Appointments */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14, marginBottom: 14 }}>
        <div className="hms-card animate-stagger-2" style={{ minWidth: 0 }}>
          <div className="card-header">
            <span className="card-title">Revenue — Last 6 Months</span>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text2)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#18ae94', display: 'inline-block' }} />Revenue
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#475569', display: 'inline-block' }} />Expenses
              </span>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={REVENUE_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="teal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18ae94" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#18ae94" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="slate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#475569" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#475569" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} width={45} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#18ae94" strokeWidth={2} fill="url(#teal)" />
                <Area type="monotone" dataKey="expenses" stroke="#475569" strokeWidth={2} fill="url(#slate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Card title="Today's Appointments" action="View All →" onAction={() => setPage('appointments')} className="animate-stagger-3">
          <div style={{ borderColor: 'var(--border)' }}>
            {todayAppts.length > 0 ? (
              todayAppts.map(a => (
                <div key={a.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.15s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#18ae94',
                    background: 'rgba(24,174,148,0.1)',
                    border: '1px solid rgba(24,174,148,0.2)',
                    borderRadius: 8,
                    padding: '2px 8px',
                    whiteSpace: 'nowrap',
                    fontFamily: 'monospace'
                  }}>{a.time}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{a.patient}</div>
                    <div style={{
                      fontSize: 11,
                      color: 'var(--text3)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{a.doctor}</div>
                  </div>
                  <Badge status={a.status} />
                </div>
              ))
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>
                No appointments for today
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent patients + Ward occupancy */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14, marginBottom: 14 }}>
        <Card title="Recent Admissions" action="All Patients →" onAction={() => setPage('patients')} className="animate-stagger-4">
          <div style={{ overflowX: 'auto' }}>
            <table className="hms-table" style={{ minWidth: 480 }}>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Ward</th>
                  <th>Doctor</th>
                  <th>Blood</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {PATIENTS.slice(0, 6).map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={p.name} size="sm" />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{p.id} · {p.age}y {p.gender[0]}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text2)' }}>{p.ward}</td>
                    <td style={{ color: 'var(--text2)' }}>{p.doctor}</td>
                    <td>
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#f59e0b',
                        background: 'rgba(245,158,11,0.1)',
                        border: '1px solid rgba(245,158,11,0.2)',
                        borderRadius: 4,
                        padding: '2px 6px'
                      }}>{p.blood}</span>
                    </td>
                    <td><Badge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Ward Occupancy" className="animate-stagger-5">
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {WARD_DATA.map(w => (
              <ProgressBar 
                key={w.name} 
                label={w.name} 
                value={w.occupied} 
                max={w.total} 
                color={w.color} 
                sublabel={`${w.occupied}/${w.total}`} 
              />
            ))}
          </div>
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text2)' }}>
            Total beds: <strong style={{ color: 'var(--text)' }}>{WARD_DATA.reduce((a, w) => a + w.total, 0)}</strong>
            &nbsp;·&nbsp; Occupied: <strong style={{ color: '#f59e0b' }}>{WARD_DATA.reduce((a, w) => a + w.occupied, 0)}</strong>
          </div>
        </Card>
      </div>

      {/* Doctors on duty */}
      <Card title="Doctors On Duty Today" action="Manage →" onAction={() => setPage('doctors')} className="animate-stagger-6">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))' }}>
          {(topDoctors.length > 0 ? topDoctors : DOCTORS).map((d, i, arr) => (
            <div key={d.id} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px 12px',
              borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              transition: 'background 0.15s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'var(--surface2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                marginBottom: 10
              }}>{d.emoji || '👨‍⚕️'}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', textAlign: 'center', lineHeight: 1.3 }}>
                {d.name || d.fullName || 'Dr. Unknown'}
              </div>
              <div style={{ fontSize: 10, color: '#18ae94', marginTop: 3, textAlign: 'center' }}>
                {d.specialization || d.spec || 'General'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
                <div className={`status-dot ${d.isAvailable ? 'available' : 'busy'}`} />
                <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'capitalize' }}>
                  {d.isAvailable ? 'Available' : 'Busy'}
                </span>
              </div>
              <div style={{ fontSize: 10, color: '#f59e0b', marginTop: 6 }}>⭐ {d.rating || '4.5'}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
});