import api from "./api";

export const authService = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }),

  register: (payload) =>
    api.post("/auth/register", payload),

  me: () => api.get("/auth/me"),

  // ADMIN ENDPOINTS
  getPending: () => api.get("/auth/admin/pending"),

  approveUser: (data) =>
    api.post("/auth/admin/approve", data),

  rejectUser: (data) =>
    api.post("/auth/admin/approve", data),
  
  getAllUsers: () => api.get("/admin/all-users"),

};