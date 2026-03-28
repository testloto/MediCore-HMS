import api from './api';

export const labService = {
  // Get all lab tests
  getAllTests: (params = {}) =>
    api.get('/laboratory/tests', { params }),

  // Get lab test by ID
  getTestById: (id) =>
    api.get(`/laboratory/tests/${id}`),

  // Create lab test
  createTest: (data) =>
    api.post('/laboratory/tests', data),

  // Update lab test
  updateTest: (id, data) =>
    api.put(`/laboratory/tests/${id}`, data),

  // Delete lab test
  deleteTest: (id) =>
    api.delete(`/laboratory/tests/${id}`),

  // Get all lab requests
  getAllRequests: (params = {}) =>
    api.get('/laboratory/requests', { params }),

  // Get lab request by ID
  getRequestById: (id) =>
    api.get(`/laboratory/requests/${id}`),

  // Create lab request
  createRequest: (data) =>
    api.post('/laboratory/requests', data),

  // Update request status
  updateRequestStatus: (id, status) =>
    api.patch(`/laboratory/requests/${id}/status?status=${status}`),

  // Update sample info
  updateSampleInfo: (id, sampleType, sampleNotes) =>
    api.patch(`/laboratory/requests/${id}/sample?sampleType=${sampleType}&sampleNotes=${sampleNotes || ''}`),

  // Enter result
  enterResult: (requestId, data) =>
    api.post(`/laboratory/requests/${requestId}/results`, data),

  // Generate report
  generateReport: (id) =>
    api.post(`/laboratory/requests/${id}/generate-report`),

  // Get requests by patient
  getByPatient: (patientId) =>
    api.get(`/laboratory/patients/${patientId}/requests`),

  // Get requests by status
  getByStatus: (status) =>
    api.get(`/laboratory/requests/status/${status}`),

  // Get pending requests
  getPending: () =>
    api.get('/laboratory/requests/pending'),

  // Get urgent requests
  getUrgent: () =>
    api.get('/laboratory/requests/urgent')
};