// src/pages/staff/Staff.jsx

import React, { useState, useEffect } from "react";
import { Badge, Avatar, Modal, SearchInput, Field } from "../../components/common";
import { exportStaff } from "../../utils/exportUtils";
import { useAuth } from "../../context/AuthContext";

// UI static dropdown values
const ROLES = [
  "Head Nurse",
  "Nurse",
  "Receptionist",
  "Lab Technician",
  "Ward Boy",
  "Pharmacist",
  "Housekeeping",
  "Security",
];

const DEPTS = [
  "Cardiology",
  "Neurology",
  "ICU",
  "Maternity",
  "Laboratory",
  "Pharmacy",
  "Front Desk",
  "General",
  "Surgery",
];

const SHIFTS = ["Morning", "Evening", "Night"];

const SHIFT_SCHEDULE = {
  Morning: { start: "07:00", end: "15:00", color: "#f59e0b" },
  Evening: { start: "15:00", end: "23:00", color: "#a855f7" },
  Night: { start: "23:00", end: "07:00", color: "#3b82f6" },
};

const emptyForm = () => ({
  name: "",
  role: "Nurse",
  dept: "General",
  shift: "Morning",
  phone: "",
  email: "",
  joined: "",
});

export default function Staff() {
  const { ALL_USERS, fetchAllUsers } = useAuth();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [deleteStaff, setDeleteStaff] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [toast, setToast] = useState("");

  // Local UI staff additions (admin-only UI)
  const [localStaff, setLocalStaff] = useState([]);

  // Load fresh list of all system users
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Combine backend users + admin-added local staff
  const staff = [...ALL_USERS, ...localStaff];

  // Filtering logic
  const filtered = staff.filter((s) => {
    const q = search.toLowerCase();
    return (
      (s.name?.toLowerCase().includes(q) ||
        s.role?.toLowerCase().includes(q) ||
        s.dept?.toLowerCase().includes(q)) &&
      (filter === "all" || s.shift?.toLowerCase() === filter)
    );
  });

  const openEdit = (s) => {
    setForm({
      name: s.name,
      role: s.role,
      dept: s.dept,
      shift: s.shift,
      phone: s.phone,
      email: s.email || "",
      joined: s.joined,
    });
    setEditStaff(s);
  };

  const handleAdd = () => {
    if (!form.name.trim()) {
      showToast("⚠ Staff name is required");
      return;
    }

    const newStaff = {
      id: "STF-" + Math.floor(Math.random() * 9000 + 1000), // Local ID
      ...form,
      status: "active",
      joined:
        form.joined || new Date().toISOString().slice(0, 10),
    };

    setLocalStaff((prev) => [newStaff, ...prev]);
    setShowAdd(false);
    showToast(`✅ ${form.name} added to staff`);
  };

  const handleEdit = () => {
    setLocalStaff((prev) =>
      prev.map((s) => (s.id === editStaff.id ? { ...s, ...form } : s))
    );
    setEditStaff(null);
    showToast(`✅ ${form.name} updated`);
  };

  const handleDelete = () => {
    setLocalStaff((prev) =>
      prev.filter((s) => s.id !== deleteStaff.id)
    );
    setDeleteStaff(null);
    showToast("🗑 Staff member removed");
  };

  const toggleStatus = (id) => {
    setLocalStaff((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next = s.status === "active" ? "inactive" : "active";
        showToast(`🔄 Status set to ${next}`);
        return { ...s, status: next };
      })
    );
  };

  const StaffForm = () => (
    <div className="grid-form">
      <Field label="Full Name">
        <input
          className="form-input"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Staff Name"
        />
      </Field>

      <Field label="Role">
        <select
          className="form-input"
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
        >
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </Field>

      <Field label="Department">
        <select
          className="form-input"
          value={form.dept}
          onChange={(e) => set("dept", e.target.value)}
        >
          {DEPTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </Field>

      <Field label="Shift">
        <select
          className="form-input"
          value={form.shift}
          onChange={(e) => set("shift", e.target.value)}
        >
          {SHIFTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
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
          type="email"
          className="form-input"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="staff@hospital.com"
        />
      </Field>

      <div style={{ gridColumn: "1 / -1" }}>
        <Field label="Joining Date">
          <input
            type="date"
            className="form-input"
            value={form.joined}
            onChange={(e) => set("joined", e.target.value)}
          />
        </Field>
      </div>
    </div>
  );

  return (
    <div>
      {toast && <div className="hms-toast">{toast}</div>}

      <div className="toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, role, dept…"
          width="w-64"
        />

        <div className="tab-bar">
          {["all", "morning", "evening", "night"].map((f) => (
            <div
              key={f}
              className={`tab-item ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </div>
          ))}
        </div>

        <div className="ml-auto flex gap-2">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => exportStaff(filtered)}
          >
            ⬇ Export CSV
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              setForm(emptyForm());
              setShowAdd(true);
            }}
          >
            ＋ Add Staff
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Staff Table */}
        <div className="xl:col-span-2 hms-card">
          <div className="table-wrap">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Shift</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className="font-mono text-xs text-brand-400 bg-brand-500/10 rounded px-1.5 py-0.5">
                        {s.id}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.name} size="sm" />
                        <span className="font-medium text-slate-200">{s.name}</span>
                      </div>
                    </td>
                    <td className="font-semibold text-slate-300">{s.role}</td>
                    <td className="text-slate-400 text-xs">{s.dept}</td>
                    <td>
                      <Badge status={s.shift?.toLowerCase()} />
                    </td>
                    <td className="text-slate-500 text-xs font-mono">{s.phone}</td>

                    <td>
                      <button
                        onClick={() => toggleStatus(s.id)}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <Badge status={s.status || "active"} />
                      </button>
                    </td>

                    <td>
                      <div className="flex gap-1.5">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEdit(s)}
                        >
                          ✏️
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteStaff(s)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-500">
                      No staff found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side panels */}
        <div className="flex flex-col gap-4">
          {/* Shift Schedule */}
          <div className="hms-card p-5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Shift Schedule
            </div>

            {Object.entries(SHIFT_SCHEDULE).map(([shift, info]) => {
              const members = staff.filter((s) => s.shift === shift);
              return (
                <div
                  key={shift}
                  className="mb-4 last:mb-0 p-3 rounded-xl border border-slate-700/50 bg-slate-800/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-200">
                      {shift} Shift
                    </span>
                    <span
                      className="font-bold font-mono text-sm"
                      style={{ color: info.color }}
                    >
                      {members.length} staff
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mb-2">
                    🕐 {info.start} — {info.end}
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {members.map((s) => (
                      <div key={s.id} title={`${s.name} — ${s.role}`}>
                        <Avatar name={s.name} size="sm" />
                      </div>
                    ))}
                    {members.length === 0 && (
                      <span className="text-xs text-slate-600">
                        No staff assigned
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Department breakdown */}
          <div className="hms-card p-5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              By Department
            </div>

            {[...new Set(staff.map((s) => s.dept))].map((dept) => {
              const count = staff.filter((s) => s.dept === dept).length;
              return (
                <div
                  key={dept}
                  className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0"
                >
                  <span className="text-xs text-slate-300">{dept}</span>
                  <span className="font-mono text-xs font-bold text-brand-400">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAdd && (
        <Modal
          title="Add Staff Member"
          onClose={() => setShowAdd(false)}
          size="md"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAdd}>
                Add Staff
              </button>
            </>
          }
        >
          <StaffForm />
        </Modal>
      )}

      {editStaff && (
        <Modal
          title={`Edit — ${editStaff.name}`}
          onClose={() => setEditStaff(null)}
          size="md"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setEditStaff(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEdit}>
                Save Changes
              </button>
            </>
          }
        >
          <StaffForm />
        </Modal>
      )}

      {deleteStaff && (
        <Modal
          title="Remove Staff"
          onClose={() => setDeleteStaff(null)}
          size="sm"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setDeleteStaff(null)}>
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
              Remove <span className="text-red-400">{deleteStaff.name}</span>?
            </div>
            <div className="text-slate-500 text-sm mt-2">
              This will remove all their records.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}