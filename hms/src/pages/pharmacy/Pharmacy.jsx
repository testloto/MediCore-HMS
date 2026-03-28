import React, { useState } from 'react';
import { Badge, Modal, SearchInput, Field } from '../../components/common';
import { MEDICINES as INITIAL, PATIENTS, DOCTORS } from '../../data/mockData';
import { exportMedicines } from '../../utils/exportUtils';
import { pharmacyService } from '../../services/pharmacyService';
import { useAuth } from '../../context/AuthContext';

let nextMedId = 9;
const emptyMed = () => ({ name:'', category:'', stock:'', unit:'Strips', threshold:'50', price:'', expiry:'', supplier:'' });
const emptyRx = () => ({ patient:PATIENTS[0].name, doctor:DOCTORS[0].name, meds:[{ med:'', dosage:'', days:'' }], instructions:'' });

export default function Pharmacy() {
  // ✅ Move hooks inside component
  const { user, DEMO_USERS } = useAuth();
  const isDemo = user && DEMO_USERS.some(d => d.id === user.id);

  const [meds, setMeds] = useState(INITIAL);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [showRx, setShowRx] = useState(false);
  const [editMed, setEditMed] = useState(null);
  const [deleteMed, setDeleteMed] = useState(null);
  const [reorderMed, setReorderMed] = useState(null);
  const [form, setForm] = useState(emptyMed());
  const [rx, setRx] = useState(emptyRx());
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = meds.filter(m => {
    const q = search.toLowerCase();
    return (m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)) &&
           (filter === 'all' || (filter === 'low' && m.stock < m.threshold));
  });

  const lowStock = meds.filter(m => m.stock < m.threshold).length;

  const handleAdd = () => {
    if(!form.name.trim()){ showToast('⚠ Medicine name is required'); return; }
    const nm = { id:`MED-${String(nextMedId++).padStart(3,'0')}`, name:form.name, category:form.category||'General', stock:+form.stock||0, unit:form.unit, threshold:+form.threshold||50, expiry:form.expiry, supplier:form.supplier, price:+form.price||0 };
    setMeds(prev => [nm, ...prev]);
    setShowAdd(false);
    showToast(`✅ ${form.name} added to inventory`);
  };

  const handleEdit = () => {
    setMeds(prev => prev.map(m => m.id === editMed.id ? { ...m, ...form, stock:+form.stock, threshold:+form.threshold, price:+form.price } : m));
    setEditMed(null);
    showToast(`✅ ${form.name} updated`);
  };

  const handleDelete = () => {
    setMeds(prev => prev.filter(m => m.id !== deleteMed.id));
    setDeleteMed(null);
    showToast('🗑 Medicine removed');
  };

  const handleReorder = () => {
    setMeds(prev => prev.map(m => m.id === reorderMed.id ? { ...m, stock:m.stock+200 } : m));
    setReorderMed(null);
    showToast(`✅ Reorder placed — 200 units added to ${reorderMed.name}`);
  };

  const openEdit = (m) => {
    setForm({ name:m.name, category:m.category, stock:String(m.stock), unit:m.unit, threshold:String(m.threshold), price:String(m.price), expiry:m.expiry, supplier:m.supplier });
    setEditMed(m);
  };

  const addRxMed = () => setRx(r => ({ ...r, meds:[ ...r.meds, { med:'', dosage:'', days:'' } ] }));
  const setRxMed = (i,k,v) => setRx(r => { const ms=[...r.meds]; ms[i] = { ...ms[i], [k]:v }; return { ...r, meds:ms }; });

  const handleRx = () => { showToast(`✅ Prescription issued for ${rx.patient}`); setShowRx(false); setRx(emptyRx()); };

  const MedForm = ({ data, onChange }) => {
    const set = (k,v) => onChange({ ...data, [k]:v });
    return (
      <div className="grid-form">
        <Field label="Medicine Name"><input className="form-input" value={data.name} onChange={e => set('name', e.target.value)} placeholder="Paracetamol 500mg"/></Field>
        <Field label="Category"><input className="form-input" value={data.category} onChange={e => set('category', e.target.value)} placeholder="Analgesic"/></Field>
        <Field label="Stock Quantity"><input type="number" className="form-input" value={data.stock} onChange={e => set('stock', e.target.value)} placeholder="500"/></Field>
        <Field label="Unit">
          <select className="form-input" value={data.unit} onChange={e => set('unit', e.target.value)}>
            <option>Strips</option><option>Tabs</option><option>Caps</option><option>Vials</option><option>Bottles</option><option>Injections</option>
          </select>
        </Field>
        <Field label="Reorder At"><input type="number" className="form-input" value={data.threshold} onChange={e => set('threshold', e.target.value)} placeholder="50"/></Field>
        <Field label="Unit Price (₹)"><input type="number" className="form-input" value={data.price} onChange={e => set('price', e.target.value)} placeholder="28"/></Field>
        <Field label="Expiry Date"><input type="date" className="form-input" value={data.expiry} onChange={e => set('expiry', e.target.value)}/></Field>
        <Field label="Supplier"><input className="form-input" value={data.supplier} onChange={e => set('supplier', e.target.value)} placeholder="Sun Pharma"/></Field>
      </div>
    );
  };

  return(
    <div>
      {toast&&<div className="hms-toast">{toast}</div>}
  {isDemo && <div style={{background:'rgba(245,158,11,0.12)',border:'1px solid rgba(245,158,11,0.3)',borderRadius:10,padding:'8px 14px',marginBottom:14,fontSize:12,color:'#fbbf24',display:'flex',alignItems:'center',gap:8}}>⚠ Backend offline — showing demo data. Changes are local only.</div>}

      <div className="resp-grid-4 mb-6" style={{ gridTemplateColumns:'repeat(2,1fr)' }}>
        {[{label:'Total Medicines',value:meds.length,icon:'💊',color:'bg-brand-500/15 text-brand-400'},{label:'Low Stock',value:lowStock,icon:'⚠️',color:'bg-amber-500/15 text-amber-400'},{label:'Categories',value:[...new Set(meds.map(m=>m.category))].length,icon:'🗂',color:'bg-blue-500/15 text-blue-400'},{label:'Prescriptions Today',value:14,icon:'📋',color:'bg-purple-500/15 text-purple-400'}].map(s=>(
          <div key={s.label} className="hms-card-hover p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</div>
            <div><div className="font-display font-bold text-xl text-slate-100">{s.value}</div><div className="text-xs text-slate-500">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Search medicine…" width="w-64"/>
        <div className="tab-bar"><div className={`tab-item ${filter==='all'?'active':''}`} onClick={()=>setFilter('all')}>All Stock</div><div className={`tab-item ${filter==='low'?'active':''}`} onClick={()=>setFilter('low')}>⚠ Low Stock ({lowStock})</div></div>
        <div className="ml-auto flex gap-2">
          <button className="btn btn-secondary btn-sm" onClick={()=>{setRx(emptyRx());setShowRx(true);}}>📋 New Prescription</button>
          <button className="btn btn-secondary btn-sm" onClick={()=>{ exportMedicines(filtered); showToast(`📥 Exported as CSV`); }}>⬇ Export CSV</button>
          <button className="btn btn-primary" onClick={()=>{setForm(emptyMed());setShowAdd(true);}}>＋ Add Medicine</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 hms-card">
          <div className="table-wrap">
            <table className="hms-table">
              <thead><tr><th>ID</th><th>Medicine</th><th>Category</th><th>Stock</th><th>Threshold</th><th>Expiry</th><th>Price</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(m=>(
                  <tr key={m.id}>
                    <td><span className="font-mono text-xs text-slate-500">{m.id}</span></td>
                    <td><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-brand-500/15 flex items-center justify-center text-sm flex-shrink-0">💊</div><span className="font-medium text-slate-200">{m.name}</span></div></td>
                    <td className="text-slate-400 text-xs">{m.category}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold font-mono text-sm ${m.stock<m.threshold?'text-red-400':'text-emerald-400'}`}>{m.stock}</span>
                        <span className="text-xs text-slate-500">{m.unit}</span>
                      </div>
                      <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden mt-1"><div className="h-full rounded-full" style={{width:`${Math.min(100,(m.stock/m.threshold)*100)}%`,background:m.stock<m.threshold?'#ef4444':'#18ae94'}}/></div>
                    </td>
                    <td className="text-slate-500 text-xs">{m.threshold}</td>
                    <td className="text-slate-500 text-xs">{m.expiry}</td>
                    <td className="font-semibold text-slate-300 text-sm">₹{m.price}</td>
                    <td>
                      <div className="flex gap-1.5">
                        <button className="btn btn-secondary btn-sm" onClick={()=>openEdit(m)}>✏️</button>
                        {m.stock<m.threshold&&<button className="btn btn-warning btn-sm" onClick={()=>setReorderMed(m)}>↑ Reorder</button>}
                        <button className="btn btn-danger btn-sm" onClick={()=>setDeleteMed(m)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="hms-card">
            <div className="card-header"><span className="card-title">Stock Levels</span></div>
            <div className="px-5 py-4 space-y-3">
              {meds.map(m=>(
                <div key={m.id}>
                  <div className="flex justify-between items-center mb-1"><span className="text-xs text-slate-300 truncate max-w-[160px]">{m.name}</span><span className={`text-xs font-bold font-mono ${m.stock<m.threshold?'text-red-400':'text-emerald-400'}`}>{m.stock}</span></div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${Math.min(100,(m.stock/500)*100)}%`,background:m.stock<m.threshold?'#ef4444':'#18ae94'}}/></div>
                </div>
              ))}
            </div>
          </div>
          {lowStock>0&&(
            <div className="hms-card border-amber-500/20">
              <div className="card-header border-amber-500/20"><span className="card-title text-amber-400">⚠ Low Stock Alerts</span><span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">{lowStock}</span></div>
              <div className="divide-y divide-slate-800">
                {meds.filter(m=>m.stock<m.threshold).map(m=>(
                  <div key={m.id} className="flex items-center gap-3 px-4 py-3 hover:bg-amber-500/5 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-sm flex-shrink-0">💊</div>
                    <div className="flex-1 min-w-0"><div className="text-xs font-semibold text-slate-200 truncate">{m.name}</div><div className="text-[11px] text-amber-400">Only {m.stock} {m.unit} left</div></div>
                    <button className="btn btn-warning btn-sm text-[11px]" onClick={()=>setReorderMed(m)}>Reorder</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showAdd&&<Modal title="Add Medicine" onClose={()=>setShowAdd(false)} size="md" footer={<><button className="btn btn-secondary" onClick={()=>setShowAdd(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAdd}>Add Medicine</button></>}><MedForm data={form} onChange={setForm}/></Modal>}

      {/* Edit Medicine Modal */}
      {editMed&&<Modal title={`Edit — ${editMed.name}`} onClose={()=>setEditMed(null)} size="md" footer={<><button className="btn btn-secondary" onClick={()=>setEditMed(null)}>Cancel</button><button className="btn btn-primary" onClick={handleEdit}>Save Changes</button></>}><MedForm data={form} onChange={setForm}/></Modal>}

      {/* Delete Confirm */}
      {deleteMed&&<Modal title="Remove Medicine" onClose={()=>setDeleteMed(null)} size="sm" footer={<><button className="btn btn-secondary" onClick={()=>setDeleteMed(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}>Remove</button></>}><div className="text-center py-4"><div className="text-4xl mb-3">🗑</div><div className="text-slate-200 font-semibold">Remove <span className="text-red-400">{deleteMed.name}</span>?</div></div></Modal>}

      {/* Reorder Confirm */}
      {reorderMed&&<Modal title="Confirm Reorder" onClose={()=>setReorderMed(null)} size="sm" footer={<><button className="btn btn-secondary" onClick={()=>setReorderMed(null)}>Cancel</button><button className="btn btn-primary" onClick={handleReorder}>✅ Place Order</button></>}><div className="text-center py-4"><div className="text-4xl mb-3">📦</div><div className="text-slate-200 font-semibold">Reorder <span className="text-brand-400">{reorderMed?.name}</span>?</div><div className="text-slate-500 text-sm mt-2">200 units will be added from <strong>{reorderMed?.supplier}</strong></div></div></Modal>}

      {/* Prescription Modal */}
      {showRx&&(
        <Modal title="New Prescription" onClose={()=>setShowRx(false)} size="md"
          footer={<><button className="btn btn-secondary" onClick={()=>setShowRx(false)}>Cancel</button><button className="btn btn-primary" onClick={handleRx}>Issue Prescription</button></>}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field label="Patient"><select className="form-input" value={rx.patient} onChange={e=>setRx(r=>({...r,patient:e.target.value}))}>{PATIENTS.map(p=><option key={p.id}>{p.name}</option>)}</select></Field>
            <Field label="Doctor"><select className="form-input" value={rx.doctor} onChange={e=>setRx(r=>({...r,doctor:e.target.value}))}>{DOCTORS.map(d=><option key={d.id}>{d.name}</option>)}</select></Field>
          </div>
          <div className="form-label mb-2">Medicines</div>
          {rx.meds.map((m,i)=>(
            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
              <select className="form-input text-xs" value={m.med} onChange={e=>setRxMed(i,'med',e.target.value)}><option value="">Select…</option>{meds.map(md=><option key={md.id}>{md.name}</option>)}</select>
              <input className="form-input text-xs" placeholder="Dosage e.g. 1-0-1" value={m.dosage} onChange={e=>setRxMed(i,'dosage',e.target.value)}/>
              <input className="form-input text-xs" placeholder="Days" value={m.days} onChange={e=>setRxMed(i,'days',e.target.value)}/>
            </div>
          ))}
          <button className="text-xs text-brand-400 hover:text-brand-300" onClick={addRxMed}>＋ Add more</button>
          <div className="mt-4"><Field label="Instructions"><textarea className="form-input resize-none" rows={2} value={rx.instructions} onChange={e=>setRx(r=>({...r,instructions:e.target.value}))} placeholder="Take after food…"/></Field></div>
        </Modal>
      )}
    </div>
  );
}
