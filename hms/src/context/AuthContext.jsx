// src/context/AuthContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService } from "../services/authService";

/* ---------------------------------------------------------
   AVATAR COLORS
--------------------------------------------------------- */
const AVATAR_COLORS = {
  admin: "from-brand-500 to-brand-700",
  doctor: "from-blue-500 to-indigo-600",
  nurse: "from-purple-500 to-pink-500",
  receptionist: "from-amber-500 to-orange-500",
  pharmacist: "from-teal-500 to-cyan-600",
  lab_technician: "from-red-500 to-rose-600",
};

/* ---------------------------------------------------------
   DEMO USERS (only used when backend offline)
--------------------------------------------------------- */
export const DEMO_USERS = [
  {
    id: "USR-001",
    name: "Dr. Admin User",
    email: "admin@medicore.in",
    password: "admin123",
    role: "admin",
    avatar: "A",
    avatarColor: AVATAR_COLORS.admin,
    dept: "Administration",
    approved: true,
  },
  {
    id: "USR-002",
    name: "Dr. Arjun Mehra",
    email: "arjun@medicore.in",
    password: "demo123",
    role: "doctor",
    avatar: "AM",
    avatarColor: AVATAR_COLORS.doctor,
    dept: "Cardiology",
    approved: true,
  },
  {
    id: "USR-003",
    name: "Ritu Sharma",
    email: "ritu@medicore.in",
    password: "demo123",
    role: "nurse",
    avatar: "RS",
    avatarColor: AVATAR_COLORS.nurse,
    dept: "Cardiology",
    approved: true,
  },
  {
    id: "USR-004",
    name: "Mohan Lal",
    email: "mohan@medicore.in",
    password: "demo123",
    role: "receptionist",
    avatar: "ML",
    avatarColor: AVATAR_COLORS.receptionist,
    dept: "Front Desk",
    approved: true,
  },
  {
    id: "USR-005",
    name: "Pooja Singh",
    email: "pooja@medicore.in",
    password: "demo123",
    role: "pharmacist",
    avatar: "PS",
    avatarColor: AVATAR_COLORS.pharmacist,
    dept: "Pharmacy",
    approved: true,
  },
  {
    id: "USR-006",
    name: "Anil Kumar",
    email: "anil@medicore.in",
    password: "demo123",
    role: "lab_technician",
    avatar: "AK",
    avatarColor: AVATAR_COLORS.lab_technician,
    dept: "Laboratory",
    approved: true,
  },
];

/* ---------------------------------------------------------
   ROLE META
--------------------------------------------------------- */
export const ROLE_META = {
  admin: { label: "Super Admin", color: "text-brand-400 bg-brand-500/15", icon: "👑" },
  doctor: { label: "Doctor", color: "text-blue-400 bg-blue-500/15", icon: "🩺" },
  nurse: { label: "Nurse", color: "text-purple-400 bg-purple-500/15", icon: "💉" },
  receptionist: { label: "Receptionist", color: "text-amber-400 bg-amber-500/15", icon: "🗂" },
  pharmacist: { label: "Pharmacist", color: "text-teal-400 bg-teal-500/15", icon: "💊" },
  lab_technician: { label: "Lab Technician", color: "text-red-400 bg-red-500/15", icon: "🔬" },
  pending: { label: "Pending", color: "text-slate-400 bg-slate-600/15", icon: "⏳" },
};

/* ---------------------------------------------------------
   MODULES
--------------------------------------------------------- */
export const ALL_MODULES = [
  "dashboard",
  "billing",
  "pharmacy",
  "patients",
  "laboratory",
  "staff",
  "appointments",
  "settings",
];

export const MODULE_LABELS = {
  dashboard: "Dashboard",
  patients: "Patients",
  doctors: "Doctors",
  appointments: "Appointments",
  billing: "Billing",
  pharmacy: "Pharmacy",
  laboratory: "Laboratory",
  staff: "Staff",
  settings: "Settings",
  permissions: "Permissions",
  pending: "Pending Users",
};

/* ---------------------------------------------------------
   DEFAULT ROLE PERMISSIONS
--------------------------------------------------------- */
export const DEFAULT_ROLE_PERMISSIONS = {
  admin: ALL_MODULES.reduce((acc, mod) => {
    acc[mod] = { view: true, create: true, edit: true, delete: true };
    return acc;
  }, {}),

  doctor: {
    dashboard: { view: true },
    patients: { view: true },
    appointments: { view: true, create: true },
    laboratory: { view: true },
  },

  nurse: {
    dashboard: { view: true },
    patients: { view: true },
    appointments: { view: true },
  },

  receptionist: {
    dashboard: { view: true },
    appointments: { view: true, create: true },
    patients: { view: true },
  },

  pharmacist: {
    dashboard: { view: true },
    pharmacy: { view: true },
  },

  lab_technician: {
    dashboard: { view: true },
    laboratory: { view: true },
  },
};

/* ---------------------------------------------------------
   Convert Backend User → App User
--------------------------------------------------------- */
function buildUserFromAPI(u) {
  if (!u) return null;

  const fullName = u.fullName || u.name || "";

  return {
    id: u.id,
    name: fullName,
    email: u.email,
    role: (u.role || "").toLowerCase(),
    dept: u.department || "",
    avatar: fullName
      ? fullName.split(" ").map((x) => x[0]).join("").toUpperCase()
      : "U",
    avatarColor: AVATAR_COLORS[(u.role || "").toLowerCase()] ?? "from-indigo-500 to-indigo-700",
    approved: u.accountStatus === "APPROVED",
  };
}

/* ---------------------------------------------------------
   AUTH CONTEXT PROVIDER
--------------------------------------------------------- */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [PENDING_USERS, setPendingUsers] = useState([]);
  const [ALL_USERS, setAllUsers] = useState([]);

  /* -----------------------------------------------------
     PERMISSION OVERRIDES
  ----------------------------------------------------- */
  const [userPermissions, setUserPermissionsState] = useState(() => {
    const saved = localStorage.getItem("userPermissions");
    return saved ? JSON.parse(saved) : {};
  });

  /* -----------------------------------------------------
     Load all users (admin only)
  ----------------------------------------------------- */
  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await authService.getAllUsers();

      if (res.data?.success) {
        setAllUsers(res.data.data.map(buildUserFromAPI));
      }
    } catch (err) {
      console.error("Error loading all users:", err);
    }
  }, []);

  /* -----------------------------------------------------
     Load pending users
  ----------------------------------------------------- */
  const fetchPending = useCallback(async () => {
    try {
      const res = await authService.getPending();
      if (res.data?.success) {
        setPendingUsers(res.data.data.map(buildUserFromAPI));
      }
    } catch {}
  }, []);

  /* -----------------------------------------------------
     Restore session
  ----------------------------------------------------- */
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);

      try {
        const res = await authService.me();
        if (res.data?.success) {
          const usr = buildUserFromAPI(res.data.data);
          setUser(usr);

          if (usr.role === "admin") {
            fetchPending();
            fetchAllUsers();
          }
        }
      } catch {
        localStorage.removeItem("token");
      }

      setLoading(false);
    };

    restore();
  }, [fetchAllUsers, fetchPending]);

  /* -----------------------------------------------------
     Login
  ----------------------------------------------------- */
  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);

      if (res.data.success) {
        const { token, ...raw } = res.data.data;
        localStorage.setItem("token", token);

        const usr = buildUserFromAPI(raw);
        setUser(usr);

        if (usr.role === "admin") {
          fetchAllUsers();
          fetchPending();
        }

        return { success: true };
      }

      return { success: false, error: res.data.message };
    } catch {
      // Fallback to demo users
      const demo = DEMO_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (demo) {
        setUser(demo);
        return { success: true, demoMode: true };
      }

      return { success: false, error: "Backend offline." };
    }
  };

  /* -----------------------------------------------------
     Register
  ----------------------------------------------------- */
  const register = async (payload) => {
    try {
      const res = await authService.register(payload);
      return res.data?.success
        ? { success: true }
        : { success: false, error: res.data?.message };
    } catch {
      return { success: false, error: "Server error. Try again." };
    }
  };

  /* -----------------------------------------------------
     Logout
  ----------------------------------------------------- */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  /* -----------------------------------------------------
     Approve / Reject Users
  ----------------------------------------------------- */
  const approveUser = async (id) => {
    await authService.approveUser({ userId: id, action: "APPROVED" });
    setPendingUsers((p) => p.filter((u) => u.id !== id));
  };

  const rejectUser = async (id) => {
    await authService.approveUser({ userId: id, action: "REJECTED" });
    setPendingUsers((p) => p.filter((u) => u.id !== id));
  };

  /* -----------------------------------------------------
     Permission Engine
  ----------------------------------------------------- */
  const getPermissions = (userId) => {
    const usr =
      ALL_USERS.find((u) => u.id === userId) ||
      DEMO_USERS.find((u) => u.id === userId) ||
      (user?.id === userId ? user : null);

    const role = usr?.role;
    const base = DEFAULT_ROLE_PERMISSIONS[role] || {};
    const custom = userPermissions[userId] || {};

    return Object.keys(base).reduce((acc, mod) => {
      acc[mod] = { ...base[mod], ...(custom[mod] || {}) };
      return acc;
    }, {});
  };

  const setUserPermissions = (userId, mod, updates) => {
    setUserPermissionsState((prev) => {
      const updated = {
        ...prev,
        [userId]: {
          ...(prev[userId] || {}),
          [mod]: {
            ...(prev[userId]?.[mod] || {}),
            ...updates,
          },
        },
      };

      localStorage.setItem("userPermissions", JSON.stringify(updated));
      return updated;
    });
  };

  const resetUserPermissions = (userId) => {
    setUserPermissionsState((prev) => {
      const updated = { ...prev };
      delete updated[userId];
      localStorage.setItem("userPermissions", JSON.stringify(updated));
      return updated;
    });
  };

  const hasCustomPermissions = (userId) => !!userPermissions[userId];

  /* -----------------------------------------------------
     can() — Permission Checker
  ----------------------------------------------------- */
  const can = (module, action = "view") => {
    if (!user) return false;
    const perms = getPermissions(user.id);
    return perms?.[module]?.[action] === true;
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        login,
        logout,
        register,

        // Users
        ALL_USERS,
        fetchAllUsers,

        // Workflow users
        PENDING_USERS,
        fetchPending,
        approveUser,
        rejectUser,

        // Permissions
        ALL_MODULES,
        MODULE_LABELS,
        ROLE_META,
        DEFAULT_ROLE_PERMISSIONS,
        getPermissions,
        setUserPermissions,
        resetUserPermissions,
        hasCustomPermissions,
        can,

        DEMO_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ---------------------------------------------------------
   Hook Export
--------------------------------------------------------- */
export function useAuth() {
  return useContext(AuthContext);
}