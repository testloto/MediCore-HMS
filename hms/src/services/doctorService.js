import api from './api';

export const doctorService = {
  // Get all doctors
  getAll: (params = {}) =>
    api.get('/doctors', { params }),

  // Get doctor by ID
  getById: (id) =>
    api.get(`/doctors/${id}`),

  // Get doctor by user ID
  getByUserId: (userId) =>
    api.get(`/doctors/user/${userId}`),

  // Get doctor by doctor ID
  getByDoctorId: (doctorId) =>
    api.get(`/doctors/doctor-id/${doctorId}`),

  // Get available doctors
  getAvailable: () =>
    api.get('/doctors/available'),

  // Get doctors by specialization
  getBySpecialization: (specialization) =>
    api.get(`/doctors/specialization/${specialization}`),

  // Create doctor
  create: (userId, data) =>
    api.post(`/doctors/user/${userId}`, data),

  // Update doctor
  update: (id, data) =>
    api.put(`/doctors/${id}`, data),

  // Update availability
  updateAvailability: (id, available) =>
    api.patch(`/doctors/${id}/availability?available=${available}`),

  // Delete doctor
  delete: (id) =>
    api.delete(`/doctors/${id}`)
};