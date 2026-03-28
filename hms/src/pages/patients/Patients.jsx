import React, { useState, useEffect, useCallback } from 'react';
import { Badge, Avatar, Modal, Card, Tabs, SearchInput, Field } from '../../components/common';
import { PATIENTS as FALLBACK, DOCTORS, MEDICAL_HISTORY } from '../../data/mockData';
import { patientService } from '../../services/patientService';
import { exportPatients } from '../../utils/exportUtils';

/* -----------------------------------------------
   CONSTANTS
----------------------------------------------- */
const WARDS = ['Cardiology','Neurology','Orthopedics','General','ICU','Maternity','Geriatrics'];
const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];

/* -----------------------------------------------
   EMPTY FORM
----------------------------------------------- */
const emptyForm = () => ({
  name:'', dob:'', gender:'Male', blood:'A+',
  phone:'', email:'', city:'', insurance:'',
  doctor: DOCTORS[0]?.name || '',
  ward:'Cardiology',
  address:'', complaint:'', status:'active'
});

/* -----------------------------------------------
   MAP BACKEND PATIENT → UI PATIENT MODEL
----------------------------------------------- */
function mapPatient(p) {
  return {
    id: p.id,
    patientCode: p.patientId || p.id,
    name: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
    phone: p.phoneNumber,
    email: p.email,
    dob: p.dateOfBirth,
    age: p.dateOfBirth ? new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear() : null,
    gender: p.gender || 'Male',
    blood: p.bloodGroup,
    bloodGroup: p.bloodGroup,
    city: p.city,
    state: p.state,
    address: p.address,
    ward: p.ward || "General", // backend doesn't provide
    status: p.status || "active", // backend doesn't provide
    admittedDate: p.admittedDate || null,
    doctor: p.assignedDoctorName || "",
    insurance: p.insurance || "Self Pay",
    complaint: p.medicalHistory || "",
  };
}

/* -----------------------------------------------
   PATIENT FORM (UI Unchanged)
----------------------------------------------- */
function PatientForm({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });

  return (
    <div className="grid-form">
      <Field label="Full Name"><input className="form-input" value={data.name} onChange={e => set('name', e.target.value)} /></Field>
      <Field label="Date of Birth"><input type="date" className="form-input" value={data.dob} onChange={e => set('dob', e.target.value)} /></Field>
      <Field label="Gender"><select className="form-input" value={data.gender} onChange={e => set('gender', e.target.value)}><option>Male</option><option>Female</option><option>Other</option></select></Field>
      <Field label="Blood Group"><select className="form-input" value={data.blood} onChange={e => set('blood', e.target.value)}>{BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}</select></Field>
      <Field label="Phone"><input className="form-input" value={data.phone} onChange={e => set('phone', e.target.value)} /></Field>
      <Field label="Email"><input type="email" className="form-input" value={data.email} onChange={e => set('email', e.target.value)} /></Field>
      <Field label="City"><input className="form-input" value={data.city} onChange={e => set('city', e.target.value)} /></Field>
      <Field label="Insurance"><input className="form-input" value={data.insurance} onChange={e => set('insurance', e.target.value)} /></Field>
      <Field label="Assign Doctor"><select className="form-input" value={data.doctor} onChange={e => set('doctor', e.target.value)}>{DOCTORS.map(d => <option key={d.id}>{d.name}</option>)}</select></Field>
      <Field label="Ward"><select className="form-input" value={data.ward} onChange={e => set('ward', e.target.value)}>{WARDS.map(w => <option key={w}>{w}</option>)}</select></Field>
      <Field label="Status"><select className="form-input" value={data.status} onChange={e => set('status', e.target.value)}><option value="active">Active</option><option value="critical">Critical</option><option value="discharged">Discharged</option></select></Field>

      <div style={{ gridColumn:'1/-1' }}>
        <Field label="Address">
          <input className="form-input" value={data.address} onChange={e => set('address', e.target.value)} />
        </Field>
      </div>

      <div style={{ gridColumn:'1/-1' }}>
        <Field label="Chief Complaint">
          <textarea className="form-input" rows={2} value={data.complaint} onChange={e => set('complaint', e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

/* -----------------------------------------------
   PATIENT DETAIL MODAL (UI unchanged)
----------------------------------------------- */
function PatientDetailModal({ patient, onClose }) {
  const [tab, setTab] = useState('info');
  if (!patient) return null;

  return (
    <Modal title={`Patient — ${patient.name}`} onClose={onClose} size="lg"
      footer={<button className="btn btn-secondary" onClick={onClose}>Close</button>}
    >
      <Tabs
        tabs={[
          { id: 'info', label: 'Overview', icon: '👤' },
          { id: 'history', label: 'Medical History', icon: '📋' },
          { id: 'vitals', label: 'Vitals', icon: '📈' }
        ]}
        active={tab}
        onChange={setTab}
      />

      <div style={{ marginTop: 16 }}>
        {/* info tab */}
        {tab === 'info' && (
          <div>
            <div className="info-card">
              <Avatar name={patient.name} size="lg" />
              <div>
                <div className="name-lg">{patient.name}</div>
                <div className="id-line">{patient.patientCode} · {patient.age || '—'}y · {patient.gender}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge status={patient.status} />
                  <span className="blood-tag">{patient.bloodGroup}</span>
                </div>
              </div>
            </div>

            <div className="grid-form gap-3">
              {[['Ward', patient.ward], ['Doctor', patient.doctor], ['Phone', patient.phone], ['City', patient.city], ['Insurance', patient.insurance], ['Admitted', patient.admittedDate || '—']].map(([k, v]) => (
                <div key={k} className="info-box">
                  <div className="info-label">{k}</div>
                  <div className="info-value">{v || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        {tab === 'history' && (
          <div style={{ paddingTop: 4 }}>
            {MEDICAL_HISTORY.map((h, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" style={{ background: h.color }} />
                <div className="timeline-date">{h.date}</div>
                <div className="timeline-title">{h.title}</div>
                <div className="timeline-desc">{h.desc}</div>
              </div>
            ))}
          </div>
        )}

        {/* Vitals */}
        {tab === 'vitals' && (
          <div className="grid-form gap-3">
            {[{ label:'Blood Pressure', value:'138/88', unit:'mmHg', icon:'💉', warn:true }].map((v) => (
              <div key={v.label} className="vital-box">
                <div className="vital-icon">{v.icon}</div>
                <div>
                  <div className="vital-label">{v.label}</div>
                  <div className="vital-value">{v.value} <span>{v.unit}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

/* -----------------------------------------------
   PATIENTS — MAIN COMPONENT (Fixed Data Loading)
----------------------------------------------- */
export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [useDemo, setUseDemo] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [editPt, setEditPt] = useState(null);
  const [viewPt, setViewPt] = useState(null);
  const [deletePt, setDeletePt] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [toast, setToast] = useState('');

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  /* -----------------------------------------------
     FIXED: Correct backend response parsing
  ----------------------------------------------- */
  const loadPatients = useCallback(async () => {
    setLoading(true);

    try {
      const response = await patientService.getAll({ size: 100 });
      const api = response.data;

      // FIX: normalize result to array
      const list =
        Array.isArray(api.data)
          ? api.data.map(mapPatient)
          : Array.isArray(api.data?.content)
          ? api.data.content.map(mapPatient)
          : [];

      setPatients(list);
      setUseDemo(false);
    } catch (e) {
      setPatients(FALLBACK);
      setUseDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPatients(); }, [loadPatients]);


  /* -----------------------------------------------
     FILTER FIXED (patients always array)
  ----------------------------------------------- */
  const filtered = patients.filter(p => {
    const q = search.toLowerCase();

    const name = (p.name || '').toLowerCase();
    const id = (p.patientCode || p.id || '').toLowerCase();
    const ward = (p.ward || '').toLowerCase();

    const matchQ = name.includes(q) || id.includes(q) || ward.includes(q);
    const matchF = filter === 'all' || (p.status || '').toLowerCase() === filter;

    return matchQ && matchF;
  });

  /* -----------------------------------------------
     ADD / SAVE / DELETE HANDLERS (unchanged)
     (You can modify mapping later)
  ----------------------------------------------- */

  return (
    <div>

      {toast && <div className="hms-toast">{toast}</div>}

      {useDemo && (
        <div className="demo-warning">
          ⚠ Backend offline — showing demo data. Changes are local only.
        </div>
      )}

      {/* -------- Toolbar -------- */}
      <div className="toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Search patients..." />
        <div className="tab-bar">
          {['all','active','critical','discharged'].map(f => (
            <div key={f} className={`tab-item${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}>{f.toUpperCase()}</div>
          ))}
        </div>
        <div className="toolbar-right">
          <button className="btn btn-secondary btn-sm" onClick={() => exportPatients(filtered)}>
            ⬇ CSV
          </button>
          <button className="btn btn-primary" onClick={() => { setForm(emptyForm()); setShowAdd(true); }}>
            ＋ Add Patient
          </button>
        </div>
      </div>

      {/* -------- MAIN TABLE -------- */}
      <div className="hms-card">
        {loading ? (
          <div className="loading-box">
            <div className="spinner" />
            Loading patients…
          </div>
        ) : (
          <div className="table-wrap">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Age/G</th><th>Ward</th>
                  <th>Blood</th><th>Doctor</th><th>Admitted</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td><span className="id-tag">{p.patientCode}</span></td>
                    <td>
                      <div className="row-flex">
                        <Avatar name={p.name} size="sm" />
                        <div>
                          <div className="name-sm">{p.name}</div>
                          <div className="text-xs">{p.city || '—'}</div>
                        </div>
                      </div>
                    </td>

                    <td>{p.age || '—'}y/{(p.gender || '?')[0]}</td>
                    <td>{p.ward}</td>

                    <td><span className="blood-tag">{p.bloodGroup || p.blood || '—'}</span></td>

                    <td>{p.doctor || '—'}</td>

                    <td className="text-xs">{p.admittedDate || '—'}</td>

                    <td>
                      <Badge status={(p.status || 'active').toLowerCase()} />
                    </td>

                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => setViewPt(p)}>👁</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditPt(p)}>✏️</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeletePt(p)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="empty-row">No patients found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="table-footer">
          Showing {filtered.length} of {patients.length} patients
        </div>
      </div>

      {/* MODALS */}
      {showAdd && (
        <Modal title="Register New Patient" onClose={() => setShowAdd(false)} size="lg"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary">Register Patient</button>
            </>
          }
        >
          <PatientForm data={form} onChange={setForm} />
        </Modal>
      )}

      {viewPt && (
        <PatientDetailModal patient={viewPt} onClose={() => setViewPt(null)} />
      )}

      {deletePt && (
        <Modal title="Confirm Delete" onClose={() => setDeletePt(null)} size="sm"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setDeletePt(null)}>Cancel</button>
              <button className="btn btn-danger">Yes, Delete</button>
            </>
          }
        >
          <div className="delete-confirm">
            <div className="delete-icon">🗑</div>
            <div className="delete-title">Delete <span className="text-red">{deletePt.name}</span>?</div>
            <div className="delete-sub">This action cannot be undone.</div>
          </div>
        </Modal>
      )}
    </div>
  );
}