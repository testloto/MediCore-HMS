// ── CSV ──────────────────────────────────────────────────────────────────
function escapeCSV(val) {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}


function buildCSV(headers, rows) {
  const head = headers.map((h) => escapeCSV(h.label)).join(",");
  const body = rows.map((row) =>
    headers
      .map((h) => {
        const val = typeof h.key === "function" ? h.key(row) : row[h.key];
        return escapeCSV(val);
      })
      .join(","),
  );
  return [head, ...body].join("\r\n");
}


function downloadCSV(csv, filename) {
  const BOM = "\uFEFF"; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


// ── EXPORTERS (one per module) ────────────────────────────────────────────


export function exportPatients(patients) {
  const headers = [
    { label: "Patient ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Age", key: "age" },
    { label: "Gender", key: "gender" },
    { label: "Blood Group", key: "blood" },
    { label: "Ward", key: "ward" },
    { label: "Status", key: "status" },
    { label: "Doctor", key: "doctor" },
    { label: "Phone", key: "phone" },
    { label: "City", key: "city" },
    { label: "Insurance", key: "insurance" },
    { label: "Admitted Date", key: "admitted" },
  ];
  downloadCSV(buildCSV(headers, patients), "medicore_patients");
}

export function exportDoctors(doctors) {
  const headers = [
    { label: "Doctor ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Specialization", key: "spec" },
    { label: "Status", key: "status" },
    { label: "Experience", key: "exp" },
    { label: "Consultation Fee", key: "fee" },
    { label: "Schedule", key: "schedule" },
    { label: "Rating", key: "rating" },
    { label: "Qualifications", key: "quals" },
    { label: "Active Patients", key: "patients" },
  ];
  downloadCSV(buildCSV(headers, doctors), "medicore_doctors");
}

export function exportAppointments(appointments) {
  const headers = [
    { label: "Appointment ID", key: "id" },
    { label: "Patient", key: "patient" },
    { label: "Doctor", key: "doctor" },
    { label: "Date", key: "date" },
    { label: "Time", key: "time" },
    { label: "Type", key: "type" },
    { label: "Room", key: "room" },
    { label: "Status", key: "status" },
  ];
  downloadCSV(buildCSV(headers, appointments), "medicore_appointments");
}

export function exportInvoices(invoices) {
  const headers = [
    { label: "Invoice ID", key: "id" },
    { label: "Patient", key: "patient" },
    { label: "Date", key: "date" },
    { label: "Services", key: (row) => (row.services || []).join(" | ") },
    { label: "Total (₹)", key: "amount" },
    { label: "Paid (₹)", key: "paid" },
    { label: "Outstanding (₹)", key: (row) => row.amount - row.paid },
    { label: "Status", key: "status" },
    { label: "Insurance", key: (row) => row.insurance || "Self Pay" },
  ];
  downloadCSV(buildCSV(headers, invoices), "medicore_invoices");
}

export function exportMedicines(medicines) {
  const headers = [
    { label: "Medicine ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Category", key: "category" },
    { label: "Stock", key: "stock" },
    { label: "Unit", key: "unit" },
    { label: "Reorder Level", key: "threshold" },
    { label: "Price (₹)", key: "price" },
    { label: "Expiry", key: "expiry" },
    { label: "Supplier", key: "supplier" },
    {
      label: "Status",
      key: (row) => (row.stock < row.threshold ? "Low Stock" : "OK"),
    },
  ];
  downloadCSV(buildCSV(headers, medicines), "medicore_pharmacy");
}


export function exportLabTests(tests) {
  const headers = [
    { label: "Test ID", key: "id" },
    { label: "Patient", key: "patient" },
    { label: "Test Name", key: "test" },
    { label: "Ordered At", key: "ordered" },
    { label: "Ordered By", key: "orderedBy" },
    { label: "Priority", key: "priority" },
    { label: "Status", key: "status" },
    { label: "Result", key: "result" },
  ];
  downloadCSV(buildCSV(headers, tests), "medicore_lab_tests");
}

export function exportStaff(staff) {
  const headers = [
    { label: "Staff ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Role", key: "role" },
    { label: "Department", key: "dept" },
    { label: "Phone", key: "phone" },
    { label: "Email", key: "email" },
    { label: "Shift", key: "shift" },
    { label: "Status", key: "status" },
    { label: "Joined", key: "joined" },
  ];
  downloadCSV(buildCSV(headers, staff), "medicore_staff");
}

// ── INVOICE PDF PRINT ────────────────────────────────────────────────────
export function printInvoice(inv) {
  const outstanding = inv.amount - inv.paid;
  const paidPct =
    inv.amount > 0 ? Math.round((inv.paid / inv.amount) * 100) : 0;

  // Parse services — handle both "Service ₹1,000" strings and objects
  const serviceRows = (inv.services || []).map((s) => {
    if (typeof s === "string") {
      // Split on the last ₹ occurrence
      const rupeeIdx = s.lastIndexOf("₹");
      if (rupeeIdx > 0) {
        return {
          label: s
            .slice(0, rupeeIdx)
            .replace(/[•\-]\s*/, "")
            .trim(),
          amount: s.slice(rupeeIdx),
        };
      }
      return { label: s, amount: "" };
    }
    return {
      label: s.label || s.name || "",
      amount: s.amount ? `₹${Number(s.amount).toLocaleString("en-IN")}` : "",
    };
  });

  const printWindow = window.open(
    "",
    "_blank",
    "width=800,height=900,scrollbars=yes",
  );
  if (!printWindow) {
    alert(
      "Pop-up blocked! Please allow pop-ups for this site to print invoices.",
    );
    return;
  }

  printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Invoice ${inv.id} — MediCore HMS</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a1a2e; padding: 0; }
    .page { width: 100%; max-width: 760px; margin: 0 auto; padding: 40px 44px; }

    /* ── Header ── */
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 3px solid #18ae94; }
    .logo-wrap { display: flex; align-items: center; gap: 12px; }
    .logo-icon { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg,#18ae94,#0e7a66); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 22px; font-weight: 700; }
    .logo-text h1 { font-size: 20px; font-weight: 700; color: #0a3d2e; letter-spacing: -0.3px; }
    .logo-text p  { font-size: 11px; color: #666; margin-top: 1px; }
    .inv-meta { text-align: right; }
    .inv-meta .inv-id { font-size: 18px; font-weight: 700; color: #0a3d2e; }
    .inv-meta .inv-date { font-size: 12px; color: #888; margin-top: 3px; }
    .status-badge { display: inline-block; margin-top: 8px; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
      background: ${inv.status === "paid" ? "#d1fae5" : inv.status === "pending" ? "#fef3c7" : "#fee2e2"};
      color: ${inv.status === "paid" ? "#065f46" : inv.status === "pending" ? "#92400e" : "#991b1b"}; }

    /* ── Parties ── */
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
    .party h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: #888; font-weight: 600; margin-bottom: 6px; }
    .party h2 { font-size: 16px; font-weight: 700; color: #1a1a2e; }
    .party p  { font-size: 12px; color: #555; margin-top: 3px; line-height: 1.6; }

    /* ── Services table ── */
    .services-title { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: #888; font-weight: 600; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
    thead th { background: #f0faf8; color: #0e7a66; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 10px 14px; text-align: left; border-bottom: 2px solid #18ae94; }
    thead th:last-child { text-align: right; }
    tbody td { padding: 11px 14px; font-size: 13px; color: #333; border-bottom: 1px solid #f0f0f0; }
    tbody td:last-child { text-align: right; font-weight: 600; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:nth-child(even) { background: #fafafa; }

    /* ── Summary ── */
    .summary { margin-top: 6px; border-top: 2px solid #e5e5e5; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 14px; font-size: 13px; color: #555; }
    .summary-row.total { background: #0a3d2e; color: #fff; border-radius: 8px; margin-top: 4px; padding: 12px 14px; }
    .summary-row.total span { font-size: 16px; font-weight: 700; }
    .summary-row.outstanding { color: #dc2626; font-weight: 600; }

    /* ── Payment bar ── */
    .payment-section { margin-top: 24px; }
    .payment-section h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: #888; font-weight: 600; margin-bottom: 8px; }
    .progress-bg { background: #e5e7eb; border-radius: 6px; height: 8px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 6px; background: ${inv.status === "paid" ? "#18ae94" : inv.status === "pending" ? "#f59e0b" : "#ef4444"}; width: ${paidPct}%; }
    .progress-labels { display: flex; justify-content: space-between; font-size: 11px; color: #888; margin-top: 5px; }

    /* ── Footer ── */
    .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer-note { font-size: 11px; color: #aaa; line-height: 1.7; }
    .footer-note strong { color: #555; }
    .signature-line { width: 160px; border-top: 1px solid #ccc; text-align: center; padding-top: 6px; font-size: 11px; color: #999; }

    /* ── Print styles ── */
    @media print {
      body { padding: 0; }
      .page { padding: 24px 28px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Print button (hidden on print) -->
  <div class="no-print" style="margin-bottom:20px;display:flex;gap:10px;justify-content:flex-end">
    <button onclick="window.print()" style="padding:10px 24px;background:#18ae94;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">🖨 Print / Save as PDF</button>
    <button onclick="window.close()" style="padding:10px 20px;background:#f0f0f0;color:#333;border:none;border-radius:8px;font-size:14px;cursor:pointer;">✕ Close</button>
  </div>

  <!-- Header -->
  <div class="header">
    <div class="logo-wrap">
      <div class="logo-icon">⚕</div>
      <div class="logo-text">
        <h1>MediCore Hospital</h1>
        <p>Bandra West, Mumbai — 400050<br>📞 022-4455-6677 &nbsp;|&nbsp; ✉ billing@medicore.in</p>
      </div>
    </div>
    <div class="inv-meta">
      <div class="inv-id">${inv.id}</div>
      <div class="inv-date">Date: ${inv.date}</div>
      ${inv.dueDate ? `<div class="inv-date">Due: ${inv.dueDate}</div>` : ""}
      <div class="status-badge">${inv.status.toUpperCase()}</div>
    </div>
  </div>

  <!-- Parties -->
  <div class="parties">
    <div class="party">
      <h3>Bill To</h3>
      <h2>${inv.patient}</h2>
      <p>${inv.insurance ? `🛡 ${inv.insurance}` : "Self Pay"}</p>
    </div>
    <div class="party">
      <h3>Bill From</h3>
      <h2>MediCore Hospital</h2>
      <p>NABH Accredited · ISO 9001:2015<br>GST: 27AAFCM9999A1ZX<br>Reg: MH/HOS/2010/4521</p>
    </div>
  </div>

  <!-- Services -->
  <div class="services-title">Services & Charges</div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Description</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${serviceRows
        .map(
          (s, i) => `
      <tr>
        <td style="color:#aaa;width:36px">${i + 1}</td>
        <td>${s.label || "—"}</td>
        <td>${s.amount || "—"}</td>
      </tr>`,
        )
        .join("")}
    </tbody>
  </table>

  <!-- Summary -->
  <div class="summary">
    <div class="summary-row">
      <span>Subtotal</span>
      <span>₹${inv.amount.toLocaleString("en-IN")}</span>
    </div>
    ${
      inv.paid > 0
        ? `<div class="summary-row" style="color:#065f46">
      <span>Amount Paid</span>
      <span>− ₹${inv.paid.toLocaleString("en-IN")}</span>
    </div>`
        : ""
    }
    ${
      outstanding > 0
        ? `<div class="summary-row outstanding">
      <span>Outstanding Balance</span>
      <span>₹${outstanding.toLocaleString("en-IN")}</span>
    </div>`
        : ""
    }
    <div class="summary-row total">
      <span>Total Amount</span>
      <span>₹${inv.amount.toLocaleString("en-IN")}</span>
    </div>
  </div>

  <!-- Payment progress -->
  <div class="payment-section">
    <h3>Payment Progress</h3>
    <div class="progress-bg"><div class="progress-fill"></div></div>
    <div class="progress-labels">
      <span>₹${inv.paid.toLocaleString("en-IN")} paid (${paidPct}%)</span>
      <span>${outstanding > 0 ? `₹${outstanding.toLocaleString("en-IN")} pending` : "✓ Fully paid"}</span>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-note">
      <strong>Payment Methods:</strong> Cash · Card · UPI · NEFT · Insurance<br>
      <strong>Bank:</strong> HDFC Bank &nbsp;|&nbsp; A/C: 5020 0012 3456 78 &nbsp;|&nbsp; IFSC: HDFC0001234<br>
      <strong>UPI:</strong> medicore@hdfcbank<br><br>
      Thank you for choosing MediCore Hospital. Get well soon! 💚
    </div>
    <div class="signature-line">Authorised Signatory</div>
  </div>

</div>
</body>
</html>`);

  printWindow.document.close();
  printWindow.focus();
}
