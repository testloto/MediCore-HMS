import api from './api';

export const appointmentService = {
  // Get all appointments
  getAll: (params = {}) =>
    api.get('/appointments', { params }),

  // Get appointment by ID
  getById: (id) =>
    api.get(`/appointments/${id}`),

  // Get appointment by number
  getByNumber: (appointmentNumber) =>
    api.get(`/appointments/number/${appointmentNumber}`),

  // Create appointment
  book: (data) =>
    api.post('/appointments', data),

  // Update appointment
  update: (id, data) =>
    api.put(`/appointments/${id}`, data),

  // Update appointment status
  updateStatus: (id, status) =>
    api.patch(`/appointments/${id}/status?status=${status}`),

  // Cancel appointment
  cancel: (id, reason) =>
    api.patch(`/appointments/${id}/cancel?reason=${reason || ''}`),

  // Get today's appointments
  getToday: () =>
    api.get('/appointments/today'),

  // Get appointments by patient
  getByPatient: (patientId) =>
    api.get(`/appointments/patient/${patientId}`),

  // Get appointments by doctor
  getByDoctor: (doctorId) =>
    api.get(`/appointments/doctor/${doctorId}`),

  // Get appointments by date
  getByDate: (date) =>
    api.get(`/appointments/date?date=${date}`),

  // Get appointments by status
  getByStatus: (status) =>
    api.get(`/appointments/status/${status}`),

  // Delete appointment
  delete: (id) =>
    api.delete(`/appointments/${id}`)
};