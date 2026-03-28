# ⚕ MediCore HMS — Hospital Management System

A full-featured, production-grade Hospital Management System built with **React 18** + **Tailwind CSS** + **Recharts**.

---

## 📁 Project Structure

```
medicore-hms/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── App.jsx                     ← Root component + routing
    ├── main.jsx                    ← React entry point
    ├── index.css                   ← Global styles + Tailwind layers
    │
    ├── data/
    │   └── mockData.js             ← All mock data (patients, doctors, etc.)
    │
    ├── components/
    │   ├── common/
    │   │   └── index.jsx           ← Badge, Avatar, Modal, Card, Tabs, StatCard…
    │   └── layout/
    │       ├── Sidebar.jsx         ← Fixed sidebar with nav groups
    │       └── Topbar.jsx          ← Top header with search, notifications
    │
    └── pages/
        ├── dashboard/Dashboard.jsx ← Charts, stats, overview
        ├── patients/Patients.jsx   ← Patient list, add/view modal, vitals
        ├── doctors/Doctors.jsx     ← Doctor cards, schedule, add doctor
        ├── appointments/           ← List view + Calendar view, booking modal
        ├── billing/Billing.jsx     ← Invoice cards, payment tracking
        ├── pharmacy/Pharmacy.jsx   ← Inventory, low-stock alerts, prescriptions
        ├── laboratory/Laboratory.jsx ← Lab orders, result tracking
        ├── staff/Staff.jsx         ← Staff table, shift scheduling
        └── settings/Settings.jsx  ← Hospital info, profile, roles, appearance
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# 1. Extract the zip and enter directory
cd medicore-hms

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

App opens at **http://localhost:3000**

### Build for Production

```bash
npm run build
npm run preview
```

---

## ✨ Features

### Modules
| Module | Features |
|--------|----------|
| 🏠 Dashboard | Live stats, revenue chart (Recharts), ward occupancy, doctor duty, recent admissions |
| 👥 Patients | Search/filter, add patient modal, vitals tab, medical history timeline |
| 🩺 Doctors | Card grid, specialization, status, ratings, add doctor form |
| 📅 Appointments | List view + Calendar view, booking modal, confirm/cancel |
| 💳 Billing | Invoice cards, payment progress, create invoice, export |
| 💊 Pharmacy | Inventory table, low-stock alerts, prescriptions modal |
| 🔬 Laboratory | Lab orders, result tracking, priority system |
| 👔 Staff | Staff table, shift schedule, department breakdown |
| ⚙️ Settings | Hospital info, profile, roles/permissions matrix, system toggles, appearance |

### UI Highlights
- 🌙 Dark navy theme with teal accent system
- 📱 Responsive grid layout
- ✨ Staggered fade-up animations on all pages
- 🔔 Live notification panel with unread count
- 📊 Recharts (Area + Bar charts)
- 🗂 Modal system with forms
- 🏷 Status badges, progress bars, avatars
- 🔍 Search + filter on all list pages
- 📅 Interactive calendar view for appointments
- 🏥 Shift schedule with avatar stacks

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **Tailwind CSS 3** — Utility-first styling
- **Recharts** — Revenue + analytics charts
- **Vite** — Fast dev server & bundler
- **Google Fonts** — Playfair Display + DM Sans

---

## 📌 Notes

- All data is **mock/static** — connect your own API via `src/data/` or `src/services/`
- Role-based routing can be wired into `App.jsx` with a context provider
- Replace chart data in `REVENUE_DATA` with real API responses

---

Made with ❤️ — MediCore HMS
