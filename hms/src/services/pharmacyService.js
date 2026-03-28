import api from './api';

export const pharmacyService = {
  // Medicine CRUD
  getAllMedicines: (params = {}) =>
    api.get('/pharmacy/medicines', { params }),

  getMedicineById: (id) =>
    api.get(`/pharmacy/medicines/${id}`),

  createMedicine: (data) =>
    api.post('/pharmacy/medicines', data),

  updateMedicine: (id, data) =>
    api.put(`/pharmacy/medicines/${id}`, data),

  deleteMedicine: (id) =>
    api.delete(`/pharmacy/medicines/${id}`),

  // Stock management
  getLowStock: () =>
    api.get('/pharmacy/medicines/low-stock'),

  getNearExpiry: (days) =>
    api.get(`/pharmacy/medicines/near-expiry?days=${days || 30}`),

  adjustStock: (data) =>
    api.post('/pharmacy/stock/adjust', data),

  getStockMovements: (medicineId) =>
    api.get(`/pharmacy/stock/movements/${medicineId}`),

  // Prescription management
  getAllPrescriptions: (params = {}) =>
    api.get('/pharmacy/prescriptions', { params }),

  getPrescriptionById: (id) =>
    api.get(`/pharmacy/prescriptions/${id}`),

  createPrescription: (data) =>
    api.post('/pharmacy/prescriptions', data),

  dispensePrescription: (data) =>
    api.post('/pharmacy/prescriptions/dispense', data),

  cancelPrescription: (id, reason) =>
    api.post(`/pharmacy/prescriptions/${id}/cancel?reason=${reason}`),

  getPrescriptionsByPatient: (patientId) =>
    api.get(`/pharmacy/patients/${patientId}/prescriptions`)
};