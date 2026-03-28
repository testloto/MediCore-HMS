import React, { useState, useEffect } from "react";
import { Badge, Modal, SearchInput, Field } from "../../components/common";
import { DOCTORS as INITIAL } from "../../data/mockData";
import { doctorService } from "../../services/doctorService";
import { exportDoctors } from "../../utils/exportUtils";

/* ---------------------------------------------------------
   MAP BACKEND → UI DOCTOR
--------------------------------------------------------- */
function mapDoctor(d) {
  return {
    id: d.id,
    name: `${d.firstName || ""} ${d.lastName || ""}`.trim(),
    spec: d.specialization || "General",
    quals: d.qualification || "",
    exp: d.yearsOfExperience || "—",
    phone: d.phoneNumber || "",
    email: d.email || "",
    fee: d.consultationFee || "—",
    dept: d.department || "General Medicine",
    schedule:
      (d.availableDays?.join(", ") || "Mon–Fri") +
      " " +
      (d.availableTimeFrom || "") +
      " - " +
      (d.availableTimeTo || ""),
    bio: d.biography || "",
    rating: 4.5,
    patients: 0,
    emoji: "⚕️",
    status: d.isAvailable ? "available" : "off-duty"
  };
}

/* ---------------------------------------------------------
   EMPTY FORM TEMPLATE
--------------------------------------------------------- */
let nextDocId = 6;
const emptyForm = () => ({
  name: "",
  spec: "",
  quals: "",
  exp: "",
  phone: "",
  email: "",
  fee: "",
  schedule: "Mon–Fri",
  dept: "General Medicine",
  bio: ""
});

/* ---------------------------------------------------------
   STATUS CYCLE
--------------------------------------------------------- */
const STATUS_CYCLE = {
  available: "busy",
  busy: "off-duty",
  "off-duty": "available"
};

/* ---------------------------------------------------------
   DOCTOR CARD (REQUIRED)
--------------------------------------------------------- */
function DoctorCard({ doctor, onEdit, onDelete, onStatusChange, onSchedule }) {
  const statusColor = {
    available: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    busy: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    "off-duty": "text-slate-400 bg-slate-700/30 border-slate-600/20"
  };

  return (
    <div className="hms-card-hover p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "var(--surface2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            border: "1px solid var(--border)"
          }}
        >
          {doctor.emoji}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div
            style={{
              fontFamily: "Playfair Display,serif",
              fontWeight: 600,
              color: "var(--text)"
            }}
          >
            {doctor.name}
          </div>
          <div style={{ fontSize: 11, color: "var(--brand)", marginTop: 2 }}>
            {doctor.spec}
          </div>

          {/* Status */}
          <button
            onClick={() => onStatusChange(doctor.id)}
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold mt-1.5 border rounded-lg px-2 py-0.5 cursor-pointer hover:opacity-80 transition-opacity ${statusColor[doctor.status]}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                doctor.status === "available"
                  ? "bg-emerald-400"
                  : doctor.status === "busy"
                  ? "bg-amber-400"
                  : "bg-slate-500"
              }`}
            />
            {doctor.status === "available"
              ? "Available"
              : doctor.status === "busy"
              ? "With Patient"
              : "Off Duty"}
          </button>
        </div>

        <div className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-1">
          ⭐ {doctor.rating}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[["Patients", doctor.patients], ["Experience", doctor.exp], ["Fee", doctor.fee]].map(
          ([k, v]) => (
            <div
              key={k}
              style={{
                background: "var(--surface2)",
                borderRadius: 10,
                padding: 10,
                textAlign: "center",
                border: "1px solid var(--border)"
              }}
            >
              <div
                style={{
                  fontFamily: "Playfair Display,serif",
                  fontWeight: 700,
                  color: "var(--text)",
                  fontSize: 14
                }}
              >
                {v}
              </div>
              <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{k}</div>
            </div>
          )
        )}
      </div>

      {/* Qualifications */}
      <div
        style={{
          fontSize: 11,
          color: "var(--text3)",
          background: "var(--surface2)",
          borderRadius: 8,
          padding: "8px 12px",
          border: "1px solid var(--border)"
        }}
      >
        🎓 {doctor.quals}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 11,
          color: "var(--text2)"
        }}
      >
        <span>📅 {doctor.schedule}</span>
        <span className="font-mono text-[10px] text-brand-400">{doctor.id}</span>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: 8,
          paddingTop: 10,
          borderTop: "1px solid var(--border)"
        }}
      >
        <button className="btn btn-secondary flex-1 btn-sm" onClick={() => onSchedule(doctor)}>
          📅 Schedule
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => onEdit(doctor)}>
          ✏️
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(doctor)}>
          🗑
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   DOCTOR FORM (REQUIRED)
--------------------------------------------------------- */
function DocForm({ form, set }) {
  return (
    <div className="grid-form">
      <Field label="Full Name">
        <input
          className="form-input"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Dr. John Doe"
        />
      </Field>

      <Field label="Specialization">
        <input
          className="form-input"
          value={form.spec}
          onChange={(e) => set("spec", e.target.value)}
          placeholder="Cardiologist"
        />
      </Field>

      <Field label="Qualifications">
        <input
          className="form-input"
          value={form.quals}
          onChange={(e) => set("quals", e.target.value)}
          placeholder="MBBS, MD"
        />
      </Field>

      <Field label="Experience (years)">
        <input
          className="form-input"
          value={form.exp}
          onChange={(e) => set("exp", e.target.value)}
          placeholder="10"
        />
      </Field>

      <Field label="Phone">
        <input
          className="form-input"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="98765 43210"
        />
      </Field>

      <Field label="Email">
        <input
          className="form-input"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="doctor@hospital.com"
        />
      </Field>

      <Field label="Consultation Fee">
        <input
          className="form-input"
          value={form.fee}
          onChange={(e) => set("fee", e.target.value)}
          placeholder="₹1000"
        />
      </Field>

      <Field label="Schedule">
        <input
          className="form-input"
          value={form.schedule}
          onChange={(e) => set("schedule", e.target.value)}
        />
      </Field>

      <div style={{ gridColumn: "1 / -1" }}>
        <Field label="Bio">
          <textarea
            className="form-input resize-none"
            value={form.bio}
            rows={2}
            onChange={(e) => set("bio", e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------- */
export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useDemo, setUseDemo] = useState(false);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const response = await doctorService.getAll({ size: 100 });
      const api = response.data;

      const list =
        Array.isArray(api.data)
          ? api.data.map(mapDoctor)
          : Array.isArray(api.data?.content)
          ? api.data.content.map(mapDoctor)
          : [];

      setDoctors(list);
      setUseDemo(false);
    } catch {
      setDoctors(INITIAL);
      setUseDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  /* ------------------- Filters ------------------- */
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = doctors.filter((d) => {
    const q = search.toLowerCase();
    const matchesText =
      d.name.toLowerCase().includes(q) ||
      d.spec.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q);

    const matchesStatus = filterStatus === "all" || d.status === filterStatus;
    return matchesText && matchesStatus;
  });

  /* ------------------- Toast ------------------- */
  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  /* ------------------- Add/Edit/Delete ------------------- */
  const [showAdd, setShowAdd] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [deleteDoc, setDeleteDoc] = useState(null);
  const [scheduleDoc, setScheduleDoc] = useState(null);
  const [form, setForm] = useState(emptyForm());

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const openEdit = (d) => {
    setForm({
      name: d.name,
      spec: d.spec,
      quals: d.quals,
      exp: d.exp,
      phone: d.phone,
      email: d.email,
      fee: d.fee,
      schedule: d.schedule,
      dept: d.dept,
      bio: d.bio
    });
    setEditDoc(d);
  };

  const handleAdd = () => {
    if (!form.name.trim()) {
      showToast("⚠ Doctor name is required");
      return;
    }

    const nd = {
      id: `D-${String(nextDocId++).padStart(3, "0")}`,
      name: form.name.startsWith("Dr.") ? form.name : `Dr. ${form.name}`,
      spec: form.spec,
      patients: 0,
      status: "available",
      emoji: "⚕️",
      rating: 4.5,
      exp: form.exp,
      schedule: form.schedule,
      fee: form.fee,
      quals: form.quals
    };

    setDoctors((prev) => [nd, ...prev]);
    setShowAdd(false);
    showToast(`✅ ${nd.name} added`);
  };

  const handleEdit = () => {
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === editDoc.id
          ? {
              ...d,
              name: form.name,
              spec: form.spec,
              quals: form.quals,
              exp: form.exp,
              fee: form.fee,
              schedule: form.schedule
            }
          : d
      )
    );
    setEditDoc(null);
    showToast(`✅ ${form.name} updated`);
  };

  const handleDelete = () => {
    setDoctors((prev) => prev.filter((d) => d.id !== deleteDoc.id));
    setDeleteDoc(null);
    showToast("🗑 Doctor removed");
  };

  const cycleStatus = (id) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const next = STATUS_CYCLE[d.status];
        showToast(`🔄 ${d.name} → ${next}`);
        return { ...d, status: next };
      })
    );
  };

  /* ---------------------------------------------------------
     UI RENDER
  --------------------------------------------------------- */
  return (
    <div>
      {toast && <div className="hms-toast">{toast}</div>}

      {useDemo && (
        <div className="demo-warning">
          ⚠ Backend offline — showing demo data.
        </div>
      )}

      {/* Toolbar */}
      <div className="toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name or specialization…"
        />

        <div className="tab-bar">
          {["all", "available", "busy", "off-duty"].map((s) => (
            <div
              key={s}
              className={`tab-item ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </div>
          ))}
        </div>

        <div className="ml-auto flex gap-2">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              exportDoctors(filtered);
              showToast(`📥 Exported ${filtered.length} doctors as CSV`);
            }}
          >
            ⬇ Export
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              setForm(emptyForm());
              setShowAdd(true);
            }}
          >
            ＋ Add Doctor
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid-3">
        {filtered.map((d) => (
          <DoctorCard
            key={d.id}
            doctor={d}
            onEdit={openEdit}
            onDelete={setDeleteDoc}
            onStatusChange={cycleStatus}
            onSchedule={setScheduleDoc}
          />
        ))}

        {filtered.length === 0 && (
          <div className="hms-card">
            <div className="text-4xl mb-3">🩺</div>
            <div className="font-semibold">No doctors found</div>
          </div>
        )}
      </div>

      {/* ADD DOCTOR */}
      {showAdd && (
        <Modal
          title="Add New Doctor"
          onClose={() => setShowAdd(false)}
          size="lg"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAdd}>
                Add Doctor
              </button>
            </>
          }
        >
          <DocForm form={form} set={set} />
        </Modal>
      )}

      {/* EDIT */}
      {editDoc && (
        <Modal
          title={`Edit — ${editDoc.name}`}
          onClose={() => setEditDoc(null)}
          size="lg"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setEditDoc(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEdit}>
                Save Changes
              </button>
            </>
          }
        >
          <DocForm form={form} set={set} />
        </Modal>
      )}

      {/* DELETE */}
      {deleteDoc && (
        <Modal
          title="Remove Doctor"
          onClose={() => setDeleteDoc(null)}
          size="sm"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setDeleteDoc(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Remove
              </button>
            </>
          }
        >
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🗑</div>
            <div className="text-slate-200 font-semibold">
              Remove <span className="text-red-400">{deleteDoc?.name}</span>?
            </div>
          </div>
        </Modal>
      )}

      {/* SCHEDULE */}
      {scheduleDoc && (
        <Modal
          title={`Schedule — ${scheduleDoc.name}`}
          onClose={() => setScheduleDoc(null)}
          size="md"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setScheduleDoc(null)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setScheduleDoc(null);
                  showToast(`✅ Schedule updated for ${scheduleDoc.name}`);
                }}
              >
                Save Schedule
              </button>
            </>
          }
        >
          {/* Add your schedule form here */}
        </Modal>
      )}
    </div>
  );
}