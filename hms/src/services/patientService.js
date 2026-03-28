import api from './api';

export const patientService = {
  // Get all patients
  getAll: (params = {}) =>
    api.get('/patients', { params }),

  // Get patient by ID
  getById: (id) =>
    api.get(`/patients/${id}`),

  // Get patient by patient ID
  getByPatientId: (patientId) =>
    api.get(`/patients/patient-id/${patientId}`),

  // Get patient by user ID
  getByUserId: (userId) =>
    api.get(`/patients/user/${userId}`),

  // Create patient - Note: userId is in URL
  create: (userId, data) =>
    api.post(`/patients/user/${userId}`, data),

  // Update patient
  update: (id, data) =>
    api.put(`/patients/${id}`, data),

  // Delete patient
  delete: (id) =>
    api.delete(`/patients/${id}`)
};