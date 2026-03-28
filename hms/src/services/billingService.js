import api from './api';

export const billingService = {
  // Get all invoices
  getAll: (params = {}) =>
    api.get('/billing/invoices', { params }),

  // Get invoice by ID
  getById: (id) =>
    api.get(`/billing/invoices/${id}`),

  // Get invoice by number
  getByNumber: (invoiceNumber) =>
    api.get(`/billing/invoices/number/${invoiceNumber}`),

  // Create invoice
  create: (data) =>
    api.post('/billing/invoices', data),

  // Process payment
  processPayment: (data) =>
    api.post('/billing/payments', data),

  // Get invoices by patient
  getByPatient: (patientId) =>
    api.get(`/billing/patients/${patientId}/invoices`),

  // Get pending invoices by patient
  getPendingByPatient: (patientId) =>
    api.get(`/billing/patients/${patientId}/pending`),

  // Get invoices by status
  getByStatus: (status) =>
    api.get(`/billing/invoices/status/${status}`),

  // Get revenue between dates
  getRevenue: (startDate, endDate) =>
    api.get(`/billing/revenue?startDate=${startDate}&endDate=${endDate}`)
};