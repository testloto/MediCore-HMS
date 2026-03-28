import React, { useState } from 'react';
import { Badge, Modal, SearchInput, Field } from '../../components/common';
import { LAB_TESTS as INITIAL, PATIENTS, DOCTORS } from '../../data/mockData';
import { exportLabTests } from '../../utils/exportUtils';
import { labService } from '../../services/labService';

let nextLabId = 7;
const emptyForm=()=>({patient:PATIENTS[0].name,orderedBy:DOCTORS[0].name,tests:[],priority:'routine',sample:'Blood',notes:''});
const TEST_LIST=['CBC','Lipid Panel','LFT','KFT','Thyroid Panel','HbA1c','ECG','Chest X-Ray','MRI Brain','CT Abdomen','Urine Routine','Blood Culture'];
const RESULT_STYLE={Normal:'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',Abnormal:'text-red-400 bg-red-500/10 border border-red-500/20',Borderline:'text-amber-400 bg-amber-500/10 border border-amber-500/20','—':'text-slate-500 bg-slate-800 border border-slate-700'};

function EnterResultModal({test,onSave,onClose}){
  const [result,setResult]=useState(test.result==='—'?'Normal':test.result);
  const [notes,setNotes]=useState('');
  return(
    <Modal title={`Enter Result — ${test.test}`} onClose={onClose} size="sm"
      footer={<><button className="btn btn-secondary" onClick={onClose}>Cancel</button><button className="btn btn-secondary btn-sm" onClick={()=>{ exportLabTests(filtered); showToast(`📥 Exported as CSV`); }}>⬇ Export CSV</button>
          <button className="btn btn-primary" onClick={()=>onSave(result,notes)}>Save Result</button></>}>
      <div className="space-y-4">
        <div className="p-3 bg-slate-800/40 rounded-xl text-sm"><span className="text-slate-400">Patient: </span><span className="font-semibold text-slate-200">{test.patient}</span></div>
        <Field label="Result">
          <select className="form-input" value={result} onChange={e=>setResult(e.target.value)}>
            <option>Normal</option><option>Borderline</option><option>Abnormal</option>
          </select>
        </Field>
        <Field label="Notes / Remarks"><textarea className="form-input resize-none" rows={3} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Add clinical notes…"/></Field>
      </div>
    </Modal>
  );
}

export default function Laboratory(){
  const [tests,setTests]=useState([]);
  const [loading,setLoading]=useState(true);
  const [useDemo,setUseDemo]=useState(false);

  const loadTests = async () => {
    setLoading(true);
    try { const {data}=await labService.getAll({size:100}); setTests(data?.content||data||[]); setUseDemo(false); }
    catch { setTests(INITIAL); setUseDemo(true); }
    finally { setLoading(false); }
  };
  React.useEffect(()=>{ loadTests(); },[]);
  const [search,setSearch]=useState('');
  const [filter,setFilter]=useState('all');
  const [showNew,setShowNew]=useState(false);
  const [enterResult,setEnterResult]=useState(null);
  const [form,setForm]=useState(emptyForm());
  const [toast,setToast]=useState('');

  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(''),2500);};

  const filtered=tests.filter(t=>{
    const q=search.toLowerCase();
    return (t.patient.toLowerCase().includes(q)||t.test.toLowerCase().includes(q)||t.id.includes(q))&&
           (filter==='all'||t.status===filter||t.priority===filter);
  });

  const handleCreate=()=>{
    if(!form.tests.length){showToast('⚠ Select at least one test');return;}
    form.tests.forEach(testName=>{
      const nt={id:`LT-${String(nextLabId++).padStart(3,'0')}`,patient:form.patient,test:testName,ordered:`${new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}`,orderedBy:form.orderedBy,status:'pending',result:'—',priority:form.priority};
      setTests(prev=>[nt,...prev]);
    });
    setShowNew(false); setForm(emptyForm()); showToast(`✅ ${form.tests.length} lab order(s) created`);
  };

  const saveResult=(id,result,notes)=>{
    setTests(prev=>prev.map(t=>t.id===id?{...t,result,status:'completed'}:t));
    setEnterResult(null);
    showToast(result==='Abnormal'?`🚨 Abnormal result recorded for review`:`✅ Result recorded: ${result}`);
  };

  const deleteTest=(id)=>{setTests(prev=>prev.filter(t=>t.id!==id));showToast('🗑 Lab order removed');};

  const toggleTest=(name)=>setForm(f=>{
    const has=f.tests.includes(name);
    return {...f,tests:has?f.tests.filter(t=>t!==name):[...f.tests,name]};
  });

  return(
    <div>
      {toast&&<div className="hms-toast">{toast}</div>}
  {useDemo && <div style={{background:'rgba(245,158,11,0.12)',border:'1px solid rgba(245,158,11,0.3)',borderRadius:10,padding:'8px 14px',marginBottom:14,fontSize:12,color:'#fbbf24',display:'flex',alignItems:'center',gap:8}}>⚠ Backend offline — showing demo data. Changes are local only.</div>}

      <div className="resp-grid-4 mb-6" style={{ gridTemplateColumns:'repeat(2,1fr)' }}>
        {[{label:'Tests Today',value:tests.length,icon:'🔬',color:'bg-brand-500/15 text-brand-400'},{label:'Urgent',value:tests.filter(t=>t.priority==='urgent').length,icon:'🚨',color:'bg-red-500/15 text-red-400'},{label:'Pending',value:tests.filter(t=>t.result==='—').length,icon:'⏳',color:'bg-amber-500/15 text-amber-400'},{label:'Abnormal',value:tests.filter(t=>t.result==='Abnormal').length,icon:'⚠️',color:'bg-red-500/15 text-red-400'}].map(s=>(
          <div key={s.label} className="hms-card-hover p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</div>
            <div><div className="font-display font-bold text-xl text-slate-100">{s.value}</div><div className="text-xs text-slate-500">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Search tests…" width="w-64"/>
        <div className="tab-bar">{[{id:'all',label:'All'},{id:'active',label:'In Progress'},{id:'pending',label:'Pending'},{id:'urgent',label:'🚨 Urgent'}].map(f=><div key={f.id} className={`tab-item ${filter===f.id?'active':''}`} onClick={()=>setFilter(f.id)}>{f.label}</div>)}</div>
        <div className="ml-auto"><button className="btn btn-primary" onClick={()=>{setForm(emptyForm());setShowNew(true);}}>＋ New Lab Order</button></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 hms-card">
          <div className="table-wrap">
            <table className="hms-table">
              <thead><tr><th>ID</th><th>Patient</th><th>Test</th><th>Ordered</th><th>By</th><th>Priority</th><th>Result</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(t=>(
                  <tr key={t.id}>
                    <td><span className="font-mono text-xs text-brand-400 bg-brand-500/10 rounded px-1.5 py-0.5">{t.id}</span></td>
                    <td className="font-medium text-slate-200">{t.patient}</td>
                    <td className="font-semibold text-slate-300">{t.test}</td>
                    <td className="text-slate-500 text-xs">{t.ordered}</td>
                    <td className="text-slate-400 text-xs">{t.orderedBy}</td>
                    <td><span className={`badge ${t.priority==='urgent'?'bg-red-500/15 text-red-400 border border-red-500/20':'bg-slate-700/50 text-slate-400'}`}>{t.priority}</span></td>
                    <td><span className={`badge ${RESULT_STYLE[t.result]}`}>{t.result}</span></td>
                    <td><Badge status={t.result==='—'?t.status:'active'}/></td>
                    <td>
                      <div className="flex gap-1.5">
                        <button className="btn btn-secondary btn-sm" onClick={()=>showToast(`📄 Opening report for ${t.patient}`)}>📄</button>
                        {t.result==='—'&&<button className="btn btn-primary btn-sm" onClick={()=>setEnterResult(t)}>Enter</button>}
                        <button className="btn btn-danger btn-sm" onClick={()=>deleteTest(t.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length===0&&<tr><td colSpan={9} className="text-center py-10 text-slate-500">No lab tests found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="hms-card p-5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Result Distribution</div>
            {[{label:'Normal',color:'#18ae94'},{label:'Borderline',color:'#f59e0b'},{label:'Abnormal',color:'#ef4444'},{label:'Pending',color:'#64748b'}].map(r=>{
              const count=tests.filter(t=>r.label==='Pending'?t.result==='—':t.result===r.label).length;
              return(
                <div key={r.label} className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:r.color}}/>
                  <div className="text-xs text-slate-400 flex-1">{r.label}</div>
                  <div className="font-bold font-mono text-sm" style={{color:r.color}}>{count}</div>
                  <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${tests.length?((count/tests.length)*100):0}%`,background:r.color}}/></div>
                </div>
              );
            })}
          </div>
          <div className="hms-card p-5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Popular Tests</div>
            {TEST_LIST.slice(0,6).map((t,i)=>(
              <div key={t} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                <span className="text-xs text-slate-300">{t}</span>
                <span className="font-mono text-xs font-bold text-slate-400">{12-i*2}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNew&&(
        <Modal title="New Lab Order" onClose={()=>setShowNew(false)} size="md"
          footer={<><button className="btn btn-secondary" onClick={()=>setShowNew(false)}>Cancel</button><button className="btn btn-primary" onClick={handleCreate}>Submit Order</button></>}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field label="Patient"><select className="form-input" value={form.patient} onChange={e=>setForm(f=>({...f,patient:e.target.value}))}>{PATIENTS.map(p=><option key={p.id}>{p.name}</option>)}</select></Field>
            <Field label="Ordered By"><select className="form-input" value={form.orderedBy} onChange={e=>setForm(f=>({...f,orderedBy:e.target.value}))}>{DOCTORS.map(d=><option key={d.id}>{d.name}</option>)}</select></Field>
            <Field label="Priority"><select className="form-input" value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}><option value="routine">Routine</option><option value="urgent">Urgent</option><option value="stat">STAT</option></select></Field>
            <Field label="Sample Type"><select className="form-input" value={form.sample} onChange={e=>setForm(f=>({...f,sample:e.target.value}))}><option>Blood</option><option>Urine</option><option>Stool</option><option>Swab</option></select></Field>
          </div>
          <div className="form-label mb-2">Tests Required <span className="text-brand-400">({form.tests.length} selected)</span></div>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {TEST_LIST.map(t=>(
              <label key={t} className={`flex items-center gap-2 text-sm cursor-pointer px-3 py-2 rounded-lg border transition-all ${form.tests.includes(t)?'border-brand-500/50 bg-brand-500/10 text-brand-300':'border-slate-700 text-slate-400 hover:border-slate-600'}`}>
                <input type="checkbox" checked={form.tests.includes(t)} onChange={()=>toggleTest(t)} className="accent-brand-500"/>
                {t}
              </label>
            ))}
          </div>
        </Modal>
      )}

      {enterResult&&<EnterResultModal test={enterResult} onClose={()=>setEnterResult(null)} onSave={(res,notes)=>saveResult(enterResult.id,res,notes)}/>}
    </div>
  );
}
