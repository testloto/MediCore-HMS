// src/App.jsx

import React, { useState, lazy, Suspense, memo } from "react";
import { useAuth } from "./context/AuthContext";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import PageLoader from "./components/common/PageLoader";
import AccessDenied from "./components/common/AccessDenied";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/home/HomePage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Patients = lazy(() => import("./pages/patients/Patients"));
const Doctors = lazy(() => import("./pages/doctors/Doctors"));
const Appointments = lazy(() => import("./pages/appointments/Appointments"));
const Billing = lazy(() => import("./pages/billing/Billing"));
const Pharmacy = lazy(() => import("./pages/pharmacy/Pharmacy"));
const Laboratory = lazy(() => import("./pages/laboratory/Laboratory"));
const Staff = lazy(() => import("./pages/staff/Staff"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const Permissions = lazy(() => import("./pages/settings/PermissionsPage"));
const PendingUsersPage = lazy(() => import("./pages/admin/PendingUsersPage"));

// Page map
const PAGES = {
  dashboard: Dashboard,
  patients: Patients,
  doctors: Doctors,
  appointments: Appointments,
  billing: Billing,
  pharmacy: Pharmacy,
  lab: Laboratory,
  staff: Staff,
  settings: Settings,
  permissions: Permissions,
  pending: PendingUsersPage,
};

// Pages requiring permission check
const GUARDED = [
  "patients",
  "doctors",
  "appointments",
  "billing",
  "pharmacy",
  "lab",
  "staff",
];

const AppShell = memo(
  ({ page, setPage, sidebarOpen, setSidebarOpen, children }) => (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {sidebarOpen && (
        <div className="hms-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar active={page} onNavigate={setPage} isOpen={sidebarOpen} />

      <div className="hms-main">
        <Topbar page={page} onMenuClick={() => setSidebarOpen((o) => !o)} />
        <main className="hms-content animate-fade-in">{children}</main>
      </div>
    </div>
  ),
);

AppShell.displayName = "AppShell";

function HMS() {
  const { user, can } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const PageComponent = PAGES[page] || Dashboard;

  const isDenied =
    (page === "permissions" && user?.role !== "admin") ||
    (page === "pending" && user?.role !== "admin") ||
    (GUARDED.includes(page) && !can(page, "view"));

  return (
    <AppShell
      page={page}
      setPage={setPage}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <Suspense fallback={<PageLoader />}>
        {isDenied ? (
          <AccessDenied page={page} onBack={() => setPage("dashboard")} />
        ) : (
          <PageComponent setPage={setPage} />
        )}
      </Suspense>
    </AppShell>
  );
}

export default function App() {
  const { user } = useAuth();
  const [view, setView] = useState("home");

  if (user) return <HMS />;

  return (
    <Suspense fallback={<PageLoader fullscreen />}>
      {view === "register" && (
        <RegisterPage
          onSwitchToLogin={() => setView("login")}
          onBack={() => setView("home")}
        />
      )}

      {view === "login" && (
        <LoginPage
          onSwitchToRegister={() => setView("register")}
          onBack={() => setView("home")}
        />
      )}

      {view === "home" && (
        <HomePage
          onLogin={() => setView("login")}
          onRegister={() => setView("register")}
        />
      )}
    </Suspense>
  );
}
