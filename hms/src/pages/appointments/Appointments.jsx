import React, { useState } from "react";
import { Badge, Modal, Tabs, SearchInput, Field } from "../../components/common";
import {
  APPOINTMENTS as INITIAL,
  PATIENTS,
  DOCTORS
} from "../../data/mockData";
import { exportAppointments } from "../../utils/exportUtils";
import { appointmentService } from "../../services/appointmentService";

/* -----------------------------------------------------------------------
   CALENDAR / UI DATA
------------------------------------------------------------------------ */
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const CAL_DAYS = [
  { day: 23, prev: true },
  { day: 24, prev: true },
  { day: 25, prev: true },
  ...Array.from({ length: 31 }, (_, i) => ({ day: i + 1 })),
  { day: 1, next: true },
  { day: 2, next: true },
  { day: 3, next: true },
  { day: 4, next: true },
  { day: 5, next: true }
];
const APPT_DAYS = [5, 8, 10, 12, 15, 18, 20, 22, 25, 28];

/* -----------------------------------------------------------------------
   BACKEND → UI MAPPER (IMPORTANT FIX)
   Your backend (AppointmentResponse.java) contains fields such as:
   - appointmentNumber, patientName, doctorName, appointmentDate, appointmentTime, status etc.
   We convert them to UI fields expected by your component.
------------------------------------------------------------------------ */
function mapAppointment(a) {
  if (!a) return null;

  const time = a.appointmentTime
    ? a.appointmentTime.toString().slice(0, 5)
    : "";

  return {
    id: a.appointmentNumber || a.id,
    patient: a.patientName || "Unknown",
    doctor: a.doctorName || "Unknown",
    type: a.reason || "Consultation",
    room: "OPD-1",
    status: a.status ? a.status.toLowerCase() : "pending",
    date: a.appointmentDate,
    time: time,
    notes: a.notes || ""
  };
}

/* -----------------------------------------------------------------------
   FORM SETUP
------------------------------------------------------------------------ */
const emptyForm = () => ({
  patient: PATIENTS[0].name,
  doctor: DOCTORS[0].name,
  date: "2026-03-15",
  time: "09:00",
  type: "Consultation",
  room: "OPD-1",
  priority: "Routine",
  notes: ""
});

let nextId = 8;

/* -----------------------------------------------------------------------
   BOOK / EDIT MODAL
------------------------------------------------------------------------ */
function BookModal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || emptyForm());
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal
      title={initial ? "Edit Appointment" : "Book Appointment"}
      onClose={onClose}
      size="md"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>
            📅 {initial ? "Save" : "Book"}
          </button>
        </>
      }
    >
      <div className="grid-form">
        <Field label="Patient">
          <select
            className="form-input"
            value={form.patient}
            onChange={(e) => set("patient", e.target.value)}
          >
            {PATIENTS.map((p) => (
              <option key={p.id}>{p.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Doctor">
          <select
            className="form-input"
            value={form.doctor}
            onChange={(e) => set("doctor", e.target.value)}
          >
            {DOCTORS.map((d) => (
              <option key={d.id}>{d.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Date">
          <input
            type="date"
            className="form-input"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </Field>

        <Field label="Time">
          <input
            type="time"
            className="form-input"
            value={form.time}
            onChange={(e) => set("time", e.target.value)}
          />
        </Field>

        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Type">
            <select
              className="form-input"
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
            >
              {[
                "Consultation",
                "Follow-up",
                "Emergency",
                "Lab Test Review",
                "Surgery Pre-op",
                "Vaccination"
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Room">
          <select
            className="form-input"
            value={form.room}
            onChange={(e) => set("room", e.target.value)}
          >
            {[
              "OPD-1",
              "OPD-2",
              "OPD-3",
              "OPD-5",
              "OPD-6",
              "OPD-7",
              "Emergency"
            ].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>

        <Field label="Priority">
          <select
            className="form-input"
            value={form.priority}
            onChange={(e) => set("priority", e.target.value)}
          >
            <option>Routine</option>
            <option>Urgent</option>
            <option>Emergency</option>
          </select>
        </Field>

        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Notes">
            <textarea
              className="form-input resize-none"
              rows={2}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
        </div>
      </div>
    </Modal>
  );
}

/* -----------------------------------------------------------------------
   MAIN APPOINTMENTS COMPONENT
------------------------------------------------------------------------ */
export default function Appointments() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useDemo, setUseDemo] = useState(false);

  /* -------------------------------------------------------------------
     FIXED: Correct backend loading logic
  ------------------------------------------------------------------- */
  const loadAppts = async () => {
    setLoading(true);

    try {
      const response = await appointmentService.getAll();
      const api = response.data;

      const list =
        Array.isArray(api.data)
          ? api.data.map(mapAppointment)
          : Array.isArray(api.data?.content)
          ? api.data.content.map(mapAppointment)
          : [];

      setAppts(list);
      setUseDemo(false);
    } catch (e) {
      setAppts(INITIAL);
      setUseDemo(true);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadAppts();
  }, []);

  /* -------------------------------------------------------------------
     FILTERS
  ------------------------------------------------------------------- */
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [showBook, setShowBook] = useState(false);
  const [editAppt, setEditAppt] = useState(null);
  const [deleteAppt, setDeleteAppt] = useState(null);
  const [toast, setToast] = useState("");
  const [calSel, setCalSel] = useState(15);

  const showToast = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 2500);
  };

  /* -------------------------------------------------------------------
     SAFE FILTER (no more crashes)
  ------------------------------------------------------------------- */
  const filtered = Array.isArray(appts)
    ? appts.filter((a) => {
        const q = search.toLowerCase();
        return (
          (a.patient || "").toLowerCase().includes(q) ||
          (a.doctor || "").toLowerCase().includes(q) ||
          (a.type || "").toLowerCase().includes(q)
        );
      })
    : [];

  /* -------------------------------------------------------------------
     STATUS ACTIONS
  ------------------------------------------------------------------- */
  const confirm = (id) => {
    setAppts((p) =>
      p.map((a) =>
        a.id === id ? { ...a, status: "scheduled" } : a
      )
    );
    showToast("✅ Appointment confirmed");
  };

  const cancel = (id) => {
    setAppts((p) =>
      p.map((a) =>
        a.id === id ? { ...a, status: "cancelled" } : a
      )
    );
    showToast("❌ Appointment cancelled");
  };

  const complete = (id) => {
    setAppts((p) =>
      p.map((a) =>
        a.id === id ? { ...a, status: "completed" } : a
      )
    );
    showToast("🟢 Completed");
  };

  const handleBook = (form) => {
    const fmt = (t) => {
      const [h, m] = t.split(":");
      const hr = +h;
      return `${hr % 12 || 12}:${m} ${hr < 12 ? "AM" : "PM"}`;
    };

    const na = {
      id: `APT-${String(nextId++).padStart(3, "0")}`,
      time: fmt(form.time),
      patient: form.patient,
      doctor: form.doctor,
      type: form.type,
      status: "pending",
      date: form.date,
      room: form.room
    };

    setAppts((p) => [na, ...p]);
    setShowBook(false);
    showToast(`📅 Appointment booked for ${form.patient}`);
  };

  const handleEdit = (form) => {
    const fmt = (t) => {
      if (t.includes("AM") || t.includes("PM")) return t;
      const [h, m] = t.split(":");
      const hr = +h;
      return `${hr % 12 || 12}:${m} ${hr < 12 ? "AM" : "PM"}`;
    };

    setAppts((p) =>
      p.map((a) =>
        a.id === editAppt.id
          ? {
              ...a,
              patient: form.patient,
              doctor: form.doctor,
              type: form.type,
              room: form.room,
              time: fmt(form.time)
            }
          : a
      )
    );

    setEditAppt(null);
    showToast("✏️ Appointment updated");
  };

  const handleDelete = () => {
    setAppts((p) => p.filter((a) => a.id !== deleteAppt.id));
    setDeleteAppt(null);
    showToast("🗑 Appointment removed");
  };

  /* -------------------------------------------------------------------
     STATUS BUTTON HANDLER
  ------------------------------------------------------------------- */
  const statusBtns = (a) => {
    if (a.status === "pending")
      return (
        <>
          <button
            className="btn btn-success btn-sm"
            onClick={() => confirm(a.id)}
          >
            ✓ Confirm
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => cancel(a.id)}
          >
            ✕ Cancel
          </button>
        </>
      );

    if (a.status === "scheduled")
      return (
        <>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => complete(a.id)}
          >
            ✓ Done
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => cancel(a.id)}
          >
            ✕
          </button>
        </>
      );

    return null;
  };

  /* -------------------------------------------------------------------
     RENDER UI (LIST + CALENDAR)
  ------------------------------------------------------------------- */
  return (
    <div>
      {toast && <div className="hms-toast">{toast}</div>}

      {useDemo && (
        <div className="demo-warning">
          ⚠ Backend offline — demo mode enabled
        </div>
      )}

      {/* Toolbar */}
      <div className="toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search patient, doctor, type…"
          width="w-64"
        />

        <Tabs
          tabs={[
            { id: "list", label: "List", icon: "📋" },
            { id: "calendar", label: "Calendar", icon: "📅" }
          ]}
          active={view}
          onChange={setView}
        />

        <div className="ml-auto flex gap-2">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              exportAppointments(filtered);
              showToast(`📥 Exported ${filtered.length} appointments`);
            }}
          >
            ⬇ Export CSV
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setShowBook(true)}
          >
            ＋ Book Appointment
          </button>
        </div>
      </div>

      {/* SUMMARY BOXES */}
      <div
        className="resp-grid-4 mb-5"
        style={{ gridTemplateColumns: "repeat(2,1fr)" }}
      >
        {[
          {
            label: "All",
            value: appts.length,
            color:
              "text-brand-400 bg-brand-500/10 border-brand-500/20"
          },
          {
            label: "Scheduled",
            value: appts.filter((a) => a.status === "scheduled")
              .length,
            color:
              "text-blue-400 bg-blue-500/10 border-blue-500/20"
          },
          {
            label: "Pending",
            value: appts.filter((a) => a.status === "pending")
              .length,
            color:
              "text-amber-400 bg-amber-500/10 border-amber-500/20"
          },
          {
            label: "Completed",
            value: appts.filter((a) => a.status === "completed")
              .length,
            color:
              "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
          }
        ].map((s) => (
          <div
            key={s.label}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${s.color}`}
          >
            <div className="font-display font-bold text-2xl">
              {s.value}
            </div>
            <div className="text-xs font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* LIST VIEW */}
      {view === "list" ? (
        <div className="hms-card">
          <div className="table-wrap">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Type</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <span className="font-mono text-xs text-brand-400 bg-brand-500/10 rounded px-1.5 py-0.5">
                        {a.id}
                      </span>
                    </td>

                    <td>
                      <span className="font-mono text-xs font-bold text-brand-300 bg-brand-500/10 border border-brand-500/20 rounded-lg px-2 py-1">
                        {a.time}
                      </span>
                    </td>

                    <td className="font-medium text-slate-200">
                      {a.patient}
                    </td>

                    <td className="text-slate-400 text-xs">{a.doctor}</td>

                    <td className="text-slate-300 text-xs">{a.type}</td>

                    <td>
                      <span className="text-xs text-slate-500 bg-slate-800 rounded-lg px-2 py-0.5">
                        {a.room}
                      </span>
                    </td>

                    <td>
                      <Badge status={a.status} />
                    </td>

                    <td>
                      <div className="flex gap-1.5 flex-wrap">
                        {statusBtns(a)}
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditAppt(a)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteAppt(a)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-7 text-slate-400"
                    >
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* -------------------------------------------------------------------
           CALENDAR VIEW
        ------------------------------------------------------------------- */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 hms-card">
            <div className="card-header">
              <span className="card-title">📅 March 2026</span>

              <div className="flex gap-2">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => showToast("◀ Previous month")}
                >
                  ‹ Prev
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => showToast("▶ Next month")}
                >
                  Next ›
                </button>
              </div>
            </div>

            <div className="p-5">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7,1fr)",
                  gap: 4,
                  marginBottom: 8
                }}
              >
                {DAYS.map((d) => (
                  <div
                    key={d}
                    style={{
                      textAlign: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text3)",
                      padding: "4px 0"
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7,1fr)",
                  gap: 4
                }}
              >
                {CAL_DAYS.map((item, i) => {
                  const isToday =
                    item.day === 15 && !item.prev && !item.next;
                  const isSel =
                    item.day === calSel && !item.prev && !item.next;
                  const hasAppt =
                    APPT_DAYS.includes(item.day) &&
                    !item.prev &&
                    !item.next;

                  return (
                    <div
                      key={i}
                      onClick={() =>
                        !item.prev && !item.next && setCalSel(item.day)
                      }
                      className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm cursor-pointer transition-all duration-150 ${
                        item.prev || item.next
                          ? "text-slate-700"
                          : "text-slate-300 hover:bg-slate-800"
                      } ${
                        isToday
                          ? "bg-brand-500 text-white hover:bg-brand-400 font-bold"
                          : ""
                      } ${
                        isSel && !isToday
                          ? "bg-slate-700 text-white"
                          : ""
                      }`}
                    >
                      {item.day}
                      {hasAppt && !isToday && (
                        <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-brand-400" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SLOTS */}
          <div className="hms-card flex flex-col">
            <span className="card-title px-4 py-3">
              March {calSel} — Slots
            </span>

            <div className="flex-1 divide-y divide-slate-800 overflow-y-auto">
              {filtered.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="font-mono text-[11px] font-bold text-brand-400 bg-brand-500/10 border border-brand-500/20 rounded-lg px-2 py-1 whitespace-nowrap">
                    {a.time}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-200 truncate">
                      {a.patient}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {a.doctor}
                    </div>
                  </div>

                  <Badge status={a.status} />
                </div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-slate-800">
              <button
                className="btn btn-primary w-full btn-sm"
                onClick={() => setShowBook(true)}
              >
                ＋ Add Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOK MODAL */}
      {showBook && (
        <BookModal
          onClose={() => setShowBook(false)}
          onSave={handleBook}
        />
      )}

      {/* EDIT MODAL */}
      {editAppt && (
        <BookModal
          onClose={() => setEditAppt(null)}
          onSave={handleEdit}
          initial={{
            patient: editAppt.patient,
            doctor: editAppt.doctor,
            date: editAppt.date,
            time: editAppt.time,
            type: editAppt.type,
            room: editAppt.room,
            priority: "Routine",
            notes: editAppt.notes
          }}
        />
      )}

      {/* DELETE MODAL */}
      {deleteAppt && (
        <Modal
          title="Cancel Appointment"
          onClose={() => setDeleteAppt(null)}
          size="sm"
          footer={
            <>
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteAppt(null)}
              >
                Keep It
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Yes, Remove
              </button>
            </>
          }
        >
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🗑</div>
            <div className="text-slate-200 font-semibold">
              Remove appointment for{" "}
              <span className="text-red-400">{deleteAppt.patient}</span>?
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}