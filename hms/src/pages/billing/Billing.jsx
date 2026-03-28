import React, { useState, useCallback } from 'react';
import { Badge, Modal, SearchInput, Field } from '../../components/common';
import { INVOICES as INITIAL, PATIENTS, DOCTORS } from '../../data/mockData';
import { printInvoice, exportInvoices } from '../../utils/exportUtils';
import { billingService } from '../../services/billingService';

let nextInvId = 5;
const emptyForm = () => ({
  patient: PATIENTS[0].name, doctor: DOCTORS[0].name,
  date: new Date().toISOString().slice(0,10),
  dueDate: '', insurance: '', notes: '',
  services: [{ label: 'Consultation', amount: '1500' }, { label: '', amount: '' }],
});

function ProgressBar({ paid, amount, status }) {
  const pct = amount > 0 ? Math.round((paid / amount) * 100) : 0;
  const color = status === 'paid' ? '#18ae94' : status === 'pending' ? '#f59e0b' : '#ef4444';
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontSize:11, color:'var(--text3)' }}>Payment progress</span>
        <span style={{ fontSize:11, color, fontWeight:600 }}>{pct}% collected</span>
      </div>
      <div style={{ height:6, background:'var(--surface3)', borderRadius:6, overflow:'hidden' }}>
        <div style={{ height:'100%', borderRadius:6, background:color, width:`${pct}%`, transition:'width 0.7s ease' }} />
      </div>
    </div>
  );
}

function InvoiceCard({ inv, onCollect, onDelete, onPrint }) {
  const outstanding = inv.amount - inv.paid;
  const statusStyle = {
    paid:    { color:'#34d399', background:'rgba(16,185,129,0.1)', borderColor:'rgba(16,185,129,0.25)' },
    unpaid:  { color:'#f87171', background:'rgba(239,68,68,0.1)',  borderColor:'rgba(239,68,68,0.25)'  },
    pending: { color:'#fbbf24', background:'rgba(245,158,11,0.1)', borderColor:'rgba(245,158,11,0.25)' },
  };
  const ss = statusStyle[inv.status] || statusStyle.unpaid;

  return (
    <div className="hms-card-hover" style={{ padding:18, display:'flex', flexDirection:'column', gap:12 }}>
      {/* Top row */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
        <div style={{ minWidth:0 }}>
          <div style={{ fontFamily:'monospace', fontSize:11, color:'var(--brand)', fontWeight:700, marginBottom:2 }}>{inv.id}</div>
          <div style={{ fontWeight:600, fontSize:14, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{inv.patient}</div>
          <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{inv.date}</div>
        </div>
        <span style={{ ...ss, border:'1px solid', borderColor:ss.borderColor, borderRadius:8, padding:'3px 10px', fontSize:11, fontWeight:700, flexShrink:0, textTransform:'uppercase', letterSpacing:'0.5px' }}>
          {inv.status}
        </span>
      </div>

      {/* Services */}
      <div style={{ background:'var(--surface2)', borderRadius:10, padding:'10px 12px' }}>
        {(inv.services || []).slice(0, 3).map((s, i) => (
          <div key={i} style={{ fontSize:12, color:'var(--text2)', paddingBottom:i < Math.min((inv.services||[]).length, 3)-1 ? 5 : 0, borderBottom: i < Math.min((inv.services||[]).length, 3)-1 ? '1px solid var(--border)' : 'none', marginBottom: i < Math.min((inv.services||[]).length, 3)-1 ? 5 : 0 }}>
            {typeof s === 'string' ? s : `${s.label} — ₹${Number(s.amount||0).toLocaleString('en-IN')}`}
          </div>
        ))}
        {(inv.services || []).length > 3 && (
          <div style={{ fontSize:11, color:'var(--text3)', marginTop:4 }}>+{inv.services.length - 3} more services</div>
        )}
      </div>

      {/* Progress bar */}
      <ProgressBar paid={inv.paid} amount={inv.amount} status={inv.status} />

      {/* Amount row */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:22, color:'var(--text)' }}>
            ₹{inv.amount.toLocaleString('en-IN')}
          </div>
          {outstanding > 0 && outstanding < inv.amount && (
            <div style={{ fontSize:11, color:'#fbbf24', marginTop:2 }}>₹{outstanding.toLocaleString('en-IN')} outstanding</div>
          )}
          {inv.insurance && (
            <div style={{ fontSize:11, color:'var(--text3)', marginTop:3 }}>🛡 {inv.insurance}</div>
          )}
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onPrint(inv)}>🖨 Print</button>
          {inv.status !== 'paid' && (
            <button className="btn btn-primary btn-sm" onClick={() => onCollect(inv.id)}>💳 Collect</button>
          )}
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(inv.id)}>🗑</button>
        </div>
      </div>
    </div>
  );
}

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [useDemo, setUseDemo]   = useState(false);

  const loadInvoices = async () => {
    setLoading(true);
    try { const {data}=await billingService.getAll({size:100}); setInvoices(data?.content||data||[]); setUseDemo(false); }
    catch { setInvoices(INITIAL); setUseDemo(true); }
    finally { setLoading(false); }
  };
  React.useEffect(()=>{ loadInvoices(); },[]);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form,     setForm]     = useState(emptyForm());
  const [toast,    setToast]    = useState('');
  const [collectId, setCollectId] = useState(null);
  const [collectAmt, setCollectAmt] = useState('');

  const showToast = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(''), 2800); }, []);

  const total       = invoices.reduce((a, i) => a + i.amount, 0);
  const collected   = invoices.reduce((a, i) => a + i.paid, 0);
  const outstanding = total - collected;
  const unpaidCount = invoices.filter(i => i.status !== 'paid').length;

  const filtered = invoices.filter(inv => {
    const q = search.toLowerCase();
    const matchQ = inv.patient.toLowerCase().includes(q) || inv.id.toLowerCase().includes(q);
    const matchF = filter === 'all' || inv.status === filter;
    return matchQ && matchF;
  });

  // Collect payment — opens partial/full modal
  const openCollect = (id) => {
    const inv = invoices.find(i => i.id === id);
    setCollectAmt(String(inv ? (inv.amount - inv.paid) : ''));
    setCollectId(id);
  };

  const confirmCollect = () => {
    const amt = Math.min(parseFloat(collectAmt) || 0, invoices.find(i => i.id === collectId)?.amount || 0);
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== collectId) return inv;
      const newPaid = Math.min(inv.paid + amt, inv.amount);
      return { ...inv, paid: newPaid, status: newPaid >= inv.amount ? 'paid' : 'pending' };
    }));
    setCollectId(null);
    showToast(`✅ ₹${amt.toLocaleString('en-IN')} collected successfully`);
  };

  const deleteInv = (id) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
    showToast('🗑 Invoice removed');
  };

  const handleCreate = () => {
    const validServices = form.services.filter(s => s.label && s.amount);
    if (!validServices.length) { showToast('⚠ Add at least one service with amount'); return; }
    const totalAmt = validServices.reduce((a, s) => a + (+s.amount || 0), 0);
    const ni = {
      id: `INV-2026-00${nextInvId++}`,
      patient: form.patient,
      doctor: form.doctor,
      amount: totalAmt,
      paid: 0,
      status: 'unpaid',
      date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
      dueDate: form.dueDate,
      services: validServices.map(s => ({ label: s.label, amount: s.amount })),
      insurance: form.insurance,
      notes: form.notes,
    };
    setInvoices(prev => [ni, ...prev]);
    setShowCreate(false);
    showToast(`✅ Invoice ${ni.id} created for ${form.patient}`);
  };

  const addService    = () => setForm(f => ({ ...f, services: [...f.services, { label:'', amount:'' }] }));
  const setService    = (i, k, v) => setForm(f => { const s = [...f.services]; s[i] = { ...s[i], [k]:v }; return { ...f, services: s }; });
  const removeService = (i) => setForm(f => ({ ...f, services: f.services.filter((_, idx) => idx !== i) }));

  const formTotal = form.services.reduce((a, s) => a + (+s.amount || 0), 0);

  return (
    <div>
      {toast && <div className="hms-toast">{toast}</div>}
      {useDemo && <div style={{background:'rgba(245,158,11,0.12)',border:'1px solid rgba(245,158,11,0.3)',borderRadius:10,padding:'8px 14px',marginBottom:14,fontSize:12,color:'#fbbf24',display:'flex',alignItems:'center',gap:8}}>⚠ Backend offline — showing demo data. Changes are local only.</div>}

      {/* Stat cards */}
      <div className="grid-stats mb-5">
        {[
          { label:'Total Billed',    value:`₹${total.toLocaleString('en-IN')}`,       icon:'🧾', color:'var(--brand)',  bg:'rgba(24,174,148,0.12)' },
          { label:'Total Collected', value:`₹${collected.toLocaleString('en-IN')}`,   icon:'✅', color:'#34d399',       bg:'rgba(16,185,129,0.12)' },
          { label:'Outstanding',     value:`₹${outstanding.toLocaleString('en-IN')}`, icon:'⏳', color:'#f87171',       bg:'rgba(239,68,68,0.12)' },
          { label:'Unpaid Invoices', value:String(unpaidCount),                        icon:'📋', color:'#fbbf24',       bg:'rgba(245,158,11,0.12)' },
        ].map(s => (
          <div key={s.label} className="hms-card-hover" style={{ padding:'16px 18px', display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, background:s.bg, flexShrink:0 }}>{s.icon}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:20, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Search invoice ID or patient…" />
        <div className="tab-bar">
          {['all','paid','pending','unpaid'].map(f => (
            <div key={f} className={`tab-item${filter===f?' active':''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </div>
          ))}
        </div>
        <div className="toolbar-right">
          <button className="btn btn-secondary btn-sm" onClick={() => { exportInvoices(filtered); showToast(`📥 Exported ${filtered.length} invoices as CSV`); }}>
            ⬇ Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => { setForm(emptyForm()); setShowCreate(true); }}>
            ＋ New Invoice
          </button>
        </div>
      </div>

      {/* Invoice grid */}
      <div className="grid-3">
        {filtered.map(inv => (
          <InvoiceCard key={inv.id} inv={inv} onCollect={openCollect} onDelete={deleteInv} onPrint={printInvoice} />
        ))}
        {filtered.length === 0 && (
          <div className="hms-card" style={{ gridColumn:'1/-1', padding:48, textAlign:'center' }}>
            <div style={{ fontSize:38, marginBottom:12 }}>🧾</div>
            <div style={{ color:'var(--text2)', fontWeight:600 }}>No invoices found</div>
            <div style={{ color:'var(--text3)', fontSize:12, marginTop:6 }}>Try adjusting your search or filter</div>
          </div>
        )}
      </div>

      {/* ── Collect Payment Modal ── */}
      {collectId && (() => {
        const inv = invoices.find(i => i.id === collectId);
        const outstanding = inv ? (inv.amount - inv.paid) : 0;
        return (
          <Modal title={`Collect Payment — ${collectId}`} onClose={() => setCollectId(null)} size="sm"
            footer={<>
              <button className="btn btn-secondary" onClick={() => setCollectId(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmCollect}>💳 Confirm Payment</button>
            </>}>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ background:'var(--surface2)', borderRadius:12, padding:16 }}>
                <div style={{ fontSize:12, color:'var(--text3)' }}>Patient</div>
                <div style={{ fontWeight:600, color:'var(--text)', marginTop:2 }}>{inv?.patient}</div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:12 }}>
                  <div><div style={{ fontSize:11, color:'var(--text3)' }}>Invoice Total</div><div style={{ fontWeight:700, color:'var(--text)' }}>₹{inv?.amount.toLocaleString('en-IN')}</div></div>
                  <div><div style={{ fontSize:11, color:'var(--text3)' }}>Already Paid</div><div style={{ fontWeight:700, color:'#34d399' }}>₹{inv?.paid.toLocaleString('en-IN')}</div></div>
                  <div><div style={{ fontSize:11, color:'var(--text3)' }}>Outstanding</div><div style={{ fontWeight:700, color:'#f87171' }}>₹{outstanding.toLocaleString('en-IN')}</div></div>
                </div>
              </div>
              <Field label="Amount to Collect (₹)">
                <input type="number" className="form-input" value={collectAmt} onChange={e => setCollectAmt(e.target.value)} placeholder={`Max ₹${outstanding.toLocaleString('en-IN')}`} min="1" max={outstanding} />
              </Field>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {['Cash','Card','UPI','NEFT','Insurance'].map(method => (
                  <button key={method} className="btn btn-secondary btn-sm"
                    style={{ fontSize:11 }}
                    onClick={() => {}}>
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* ── Create Invoice Modal ── */}
      {showCreate && (
        <Modal title="Create New Invoice" onClose={() => setShowCreate(false)} size="lg"
          footer={<>
            <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>🧾 Generate Invoice</button>
          </>}>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="grid-form">
              <Field label="Patient">
                <select className="form-input" value={form.patient} onChange={e => setForm(f => ({ ...f, patient:e.target.value }))}>
                  {PATIENTS.map(p => <option key={p.id}>{p.name}</option>)}
                </select>
              </Field>
              <Field label="Doctor">
                <select className="form-input" value={form.doctor} onChange={e => setForm(f => ({ ...f, doctor:e.target.value }))}>
                  {DOCTORS.map(d => <option key={d.id}>{d.name}</option>)}
                </select>
              </Field>
              <Field label="Invoice Date">
                <input type="date" className="form-input" value={form.date} onChange={e => setForm(f => ({ ...f, date:e.target.value }))} />
              </Field>
              <Field label="Due Date (optional)">
                <input type="date" className="form-input" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate:e.target.value }))} />
              </Field>
              <div style={{ gridColumn:'1/-1' }}>
                <Field label="Insurance / Policy No.">
                  <input className="form-input" value={form.insurance} onChange={e => setForm(f => ({ ...f, insurance:e.target.value }))} placeholder="e.g. Star Health — POL-123456" />
                </Field>
              </div>
            </div>

            {/* Services */}
            <div style={{ border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' }}>
              <div style={{ background:'var(--surface2)', padding:'10px 16px', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', color:'var(--text3)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span>Services & Charges</span>
                <button onClick={addService} style={{ fontSize:12, color:'var(--brand)', fontWeight:600, background:'none', border:'none', cursor:'pointer' }}>＋ Add Row</button>
              </div>
              <div style={{ padding:'12px 16px', display:'flex', flexDirection:'column', gap:8 }}>
                {/* Header */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 130px 36px', gap:8 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Service / Description</span>
                  <span style={{ fontSize:10, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Amount (₹)</span>
                  <span />
                </div>
                {form.services.map((s, i) => (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 130px 36px', gap:8, alignItems:'center' }}>
                    <input className="form-input" placeholder="e.g. ECG, Consultation, Room charge" value={s.label} onChange={e => setService(i, 'label', e.target.value)} />
                    <input className="form-input" placeholder="0" type="number" min="0" value={s.amount} onChange={e => setService(i, 'amount', e.target.value)} />
                    <button className="btn btn-danger btn-sm" style={{ padding:'6px 8px', width:36 }} onClick={() => removeService(i)}>✕</button>
                  </div>
                ))}
                <div style={{ borderTop:'1px solid var(--border)', paddingTop:10, display:'flex', justifyContent:'flex-end', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:12, color:'var(--text2)' }}>Invoice Total</span>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:20, color:'var(--brand)' }}>₹{formTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <Field label="Notes / Payment Terms">
              <textarea className="form-input" style={{ resize:'none' }} rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes:e.target.value }))} placeholder="e.g. Payment due within 30 days. Thank you." />
            </Field>
          </div>
        </Modal>
      )}
    </div>
  );
}
