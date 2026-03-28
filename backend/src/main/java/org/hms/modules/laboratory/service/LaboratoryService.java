package org.hms.modules.laboratory.service;

import org.hms.common.exception.ResourceNotFoundException;
import org.hms.modules.appointments.repository.AppointmentRepository;
import org.hms.modules.doctors.repository.DoctorRepository;
import org.hms.modules.laboratory.dto.*;
import org.hms.modules.laboratory.entity.*;
import org.hms.modules.laboratory.repository.LabRequestRepository;
import org.hms.modules.laboratory.repository.LabResultRepository;
import org.hms.modules.laboratory.repository.LabTestRepository;
import org.hms.modules.patients.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LaboratoryService {

    private final LabTestRepository labTestRepository;
    private final LabRequestRepository labRequestRepository;
    private final LabResultRepository labResultRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    // Lab Test Management
    @Transactional
    public LabTestResponse createLabTest(LabTestRequest request) {
        if (labTestRepository.existsByTestCode(request.getTestCode())) {
            throw new RuntimeException("Lab test with code " + request.getTestCode() + " already exists");
        }

        LabTest labTest = LabTest.builder()
                .testCode(request.getTestCode())
                .testName(request.getTestName())
                .category(request.getCategory())
                .description(request.getDescription())
                .instructions(request.getInstructions())
                .preparationInstructions(request.getPreparationInstructions())
                .normalRange(request.getNormalRange())
                .unit(request.getUnit())
                .cost(request.getCost())
                .turnaroundTimeHours(request.getTurnaroundTimeHours())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        LabTest savedTest = labTestRepository.save(labTest);
        return mapToTestResponse(savedTest);
    }

    @Transactional(readOnly = true)
    public LabTestResponse getLabTestById(Long id) {
        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab test not found with id: " + id));
        return mapToTestResponse(labTest);
    }

    @Transactional(readOnly = true)
    public LabTestResponse getLabTestByCode(String testCode) {
        LabTest labTest = labTestRepository.findByTestCode(testCode)
                .orElseThrow(() -> new ResourceNotFoundException("Lab test not found with code: " + testCode));
        return mapToTestResponse(labTest);
    }

    @Transactional(readOnly = true)
    public List<LabTestResponse> getAllLabTests() {
        return labTestRepository.findAll().stream()
                .map(this::mapToTestResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LabTestResponse> getActiveLabTests() {
        return labTestRepository.findByIsActiveTrue().stream()
                .map(this::mapToTestResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LabTestResponse updateLabTest(Long id, LabTestRequest request) {
        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab test not found with id: " + id));

        labTest.setTestName(request.getTestName());
        labTest.setCategory(request.getCategory());
        labTest.setDescription(request.getDescription());
        labTest.setInstructions(request.getInstructions());
        labTest.setPreparationInstructions(request.getPreparationInstructions());
        labTest.setNormalRange(request.getNormalRange());
        labTest.setUnit(request.getUnit());
        labTest.setCost(request.getCost());
        labTest.setTurnaroundTimeHours(request.getTurnaroundTimeHours());

        if (request.getIsActive() != null) {
            labTest.setIsActive(request.getIsActive());
        }

        LabTest updatedTest = labTestRepository.save(labTest);
        return mapToTestResponse(updatedTest);
    }

    @Transactional
    public void deleteLabTest(Long id) {
        if (!labTestRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lab test not found with id: " + id);
        }
        labTestRepository.deleteById(id);
    }

    // Lab Request Management
    @Transactional
    public LabRequestResponse createLabRequest(LabRequestDTO request) {
        var patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + request.getPatientId()));

        var doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));

        var appointment = request.getAppointmentId() != null ?
                appointmentRepository.findById(request.getAppointmentId()).orElse(null) : null;

        String currentUser = getCurrentUsername();

        LabRequest labRequest = LabRequest.builder()
                .requestNumber(generateRequestNumber())
                .patient(patient)
                .doctor(doctor)
                .appointment(appointment)
                .requestDate(LocalDateTime.now())
                .requestedBy(currentUser)
                .status(LabRequestStatus.PENDING)
                .clinicalNotes(request.getClinicalNotes())
                .diagnosis(request.getDiagnosis())
                .isUrgent(request.getIsUrgent() != null ? request.getIsUrgent() : false)
                .build();

        LabRequest savedRequest = labRequestRepository.save(labRequest);

        // Create results entries for each test
        if (request.getTests() != null) {
            for (LabTestItemDTO testItem : request.getTests()) {
                LabTest labTest = labTestRepository.findById(testItem.getLabTestId())
                        .orElseThrow(() -> new ResourceNotFoundException("Lab test not found with id: " + testItem.getLabTestId()));

                LabResult result = LabResult.builder()
                        .labRequest(savedRequest)
                        .labTest(labTest)
                        .testName(labTest.getTestName())
                        .unit(labTest.getUnit())
                        .referenceRange(labTest.getNormalRange())
                        .remarks(testItem.getRemarks())
                        .build();

                labResultRepository.save(result);
            }
        }

        return mapToRequestResponse(savedRequest);
    }

    @Transactional(readOnly = true)
    public LabRequestResponse getLabRequestById(Long id) {
        LabRequest labRequest = labRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab request not found with id: " + id));
        return mapToRequestResponse(labRequest);
    }

    @Transactional(readOnly = true)
    public LabRequestResponse getLabRequestByNumber(String requestNumber) {
        LabRequest labRequest = labRequestRepository.findByRequestNumber(requestNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Lab request not found with number: " + requestNumber));
        return mapToRequestResponse(labRequest);
    }

    @Transactional(readOnly = true)
    public List<LabRequestResponse> getLabRequestsByPatient(Long patientId) {
        return labRequestRepository.findPatientLabRequests(patientId).stream()
                .map(this::mapToRequestResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LabRequestResponse> getLabRequestsByStatus(LabRequestStatus status) {
        return labRequestRepository.findByStatus(status).stream()
                .map(this::mapToRequestResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LabRequestResponse updateRequestStatus(Long id, LabRequestStatus status) {
        LabRequest labRequest = labRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab request not found with id: " + id));

        labRequest.setStatus(status);

        // Update timestamps based on status
        String currentUser = getCurrentUsername();

        switch (status) {
            case SAMPLE_COLLECTED:
                labRequest.setSampleCollectedDate(LocalDateTime.now());
                labRequest.setSampleCollectedBy(currentUser);
                break;
            case COMPLETED:
                labRequest.setResultDate(LocalDateTime.now());
                labRequest.setResultEnteredBy(currentUser);
                break;
            case REVIEWED:
                labRequest.setResultApprovedDate(LocalDateTime.now());
                labRequest.setResultApprovedBy(currentUser);
                break;
        }

        LabRequest updatedRequest = labRequestRepository.save(labRequest);
        return mapToRequestResponse(updatedRequest);
    }

    @Transactional
    public LabRequestResponse updateSampleInfo(Long id, String sampleType, String sampleNotes) {
        LabRequest labRequest = labRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab request not found with id: " + id));

        labRequest.setSampleType(sampleType);
        labRequest.setSampleNotes(sampleNotes);
        labRequest.setStatus(LabRequestStatus.SAMPLE_PENDING);

        LabRequest updatedRequest = labRequestRepository.save(labRequest);
        return mapToRequestResponse(updatedRequest);
    }

    @Transactional
    public LabResultResponse enterResult(Long requestId, LabResultEntryDTO resultEntry) {
        LabRequest labRequest = labRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab request not found with id: " + requestId));

        LabResult result = labResultRepository.findById(resultEntry.getLabTestId())
                .orElseThrow(() -> new ResourceNotFoundException("Lab result not found with id: " + resultEntry.getLabTestId()));

        if (!result.getLabRequest().getId().equals(requestId)) {
            throw new RuntimeException("Result does not belong to this request");
        }

        result.setValue(resultEntry.getValue());
        result.setRemarks(resultEntry.getRemarks());
        result.setInterpretation(resultEntry.getInterpretation());
        result.setTestDate(LocalDateTime.now());
        result.setPerformedBy(getCurrentUsername());

        // Determine if abnormal
        if (result.getReferenceRange() != null && result.getValue() != null) {
            // Simple logic - in real app, you'd parse ranges properly
            result.setIsAbnormal(true); // You'd implement proper logic here
        }

        LabResult savedResult = labResultRepository.save(result);

        // Check if all results are entered
        boolean allResultsEntered = labRequest.getResults().stream()
                .allMatch(r -> r.getValue() != null);

        if (allResultsEntered) {
            labRequest.setStatus(LabRequestStatus.COMPLETED);
            labRequest.setResultDate(LocalDateTime.now());
            labRequest.setResultEnteredBy(getCurrentUsername());
            labRequestRepository.save(labRequest);
        }

        return mapToResultResponse(savedResult);
    }

    @Transactional
    public LabRequestResponse generateReport(Long id) {
        LabRequest labRequest = labRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab request not found with id: " + id));

        StringBuilder html = new StringBuilder();
        html.append("<html><body>");
        html.append("<h1>Laboratory Report</h1>");
        html.append("<p>Request Number: ").append(labRequest.getRequestNumber()).append("</p>");
        html.append("<p>Patient: ").append(labRequest.getPatient().getUser().getFullName()).append("</p>");
        html.append("<p>Doctor: Dr. ").append(labRequest.getDoctor().getUser().getFullName()).append("</p>");
        html.append("<p>Request Date: ").append(labRequest.getRequestDate()).append("</p>");
        html.append("<p>Report Date: ").append(LocalDateTime.now()).append("</p>");

        html.append("<h2>Test Results</h2>");
        html.append("<table border='1'><tr><th>Test</th><th>Result</th><th>Reference Range</th><th>Unit</th></tr>");

        for (LabResult result : labRequest.getResults()) {
            html.append("<tr>");
            html.append("<td>").append(result.getTestName()).append("</td>");
            html.append("<td>").append(result.getValue() != null ? result.getValue() : "Pending").append("</td>");
            html.append("<td>").append(result.getReferenceRange() != null ? result.getReferenceRange() : "").append("</td>");
            html.append("<td>").append(result.getUnit() != null ? result.getUnit() : "").append("</td>");
            html.append("</tr>");
        }

        html.append("</table>");
        html.append("</body></html>");

        labRequest.setReportHtml(html.toString());
        labRequest.setStatus(LabRequestStatus.REVIEWED);
        labRequest.setResultApprovedBy(getCurrentUsername());
        labRequest.setResultApprovedDate(LocalDateTime.now());

        LabRequest updatedRequest = labRequestRepository.save(labRequest);
        return mapToRequestResponse(updatedRequest);
    }

    @Transactional(readOnly = true)
    public List<LabRequestResponse> getPendingRequests() {
        return labRequestRepository.findByStatus(LabRequestStatus.PENDING).stream()
                .map(this::mapToRequestResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LabRequestResponse> getUrgentRequests() {
        return labRequestRepository.findUrgentByStatus(LabRequestStatus.PENDING).stream()
                .map(this::mapToRequestResponse)
                .collect(Collectors.toList());
    }

    // Helper methods
    private String generateRequestNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.format("%04d", new Random().nextInt(10000));
        return "LAB" + timestamp + random;
    }

    private String getCurrentUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return principal.toString();
    }

    // Mapping methods
    private LabTestResponse mapToTestResponse(LabTest labTest) {
        return LabTestResponse.builder()
                .id(labTest.getId())
                .testCode(labTest.getTestCode())
                .testName(labTest.getTestName())
                .category(labTest.getCategory())
                .description(labTest.getDescription())
                .instructions(labTest.getInstructions())
                .preparationInstructions(labTest.getPreparationInstructions())
                .normalRange(labTest.getNormalRange())
                .unit(labTest.getUnit())
                .cost(labTest.getCost())
                .turnaroundTimeHours(labTest.getTurnaroundTimeHours())
                .isActive(labTest.getIsActive())
                .createdAt(labTest.getCreatedAt())
                .updatedAt(labTest.getUpdatedAt())
                .build();
    }

    private LabRequestResponse mapToRequestResponse(LabRequest labRequest) {
        List<LabResultResponse> resultResponses = labRequest.getResults().stream()
                .map(this::mapToResultResponse)
                .collect(Collectors.toList());

        return LabRequestResponse.builder()
                .id(labRequest.getId())
                .requestNumber(labRequest.getRequestNumber())
                .patientId(labRequest.getPatient().getId())
                .patientName(labRequest.getPatient().getUser().getFullName())
                .patientIdNumber(labRequest.getPatient().getPatientId())
                .doctorId(labRequest.getDoctor().getId())
                .doctorName("Dr. " + labRequest.getDoctor().getUser().getFullName())
                .appointmentId(labRequest.getAppointment() != null ? labRequest.getAppointment().getId() : null)
                .appointmentNumber(labRequest.getAppointment() != null ? labRequest.getAppointment().getAppointmentNumber() : null)
                .requestDate(labRequest.getRequestDate())
                .requestedBy(labRequest.getRequestedBy())
                .status(labRequest.getStatus())
                .clinicalNotes(labRequest.getClinicalNotes())
                .diagnosis(labRequest.getDiagnosis())
                .isUrgent(labRequest.getIsUrgent())
                .sampleCollectedDate(labRequest.getSampleCollectedDate())
                .sampleCollectedBy(labRequest.getSampleCollectedBy())
                .sampleType(labRequest.getSampleType())
                .sampleNotes(labRequest.getSampleNotes())
                .resultDate(labRequest.getResultDate())
                .resultEnteredBy(labRequest.getResultEnteredBy())
                .resultApprovedBy(labRequest.getResultApprovedBy())
                .resultApprovedDate(labRequest.getResultApprovedDate())
                .results(resultResponses)
                .reportHtml(labRequest.getReportHtml())
                .reportPdfPath(labRequest.getReportPdfPath())
                .notes(labRequest.getNotes())
                .createdAt(labRequest.getCreatedAt())
                .updatedAt(labRequest.getUpdatedAt())
                .build();
    }

    private LabResultResponse mapToResultResponse(LabResult result) {
        return LabResultResponse.builder()
                .id(result.getId())
                .labTestId(result.getLabTest().getId())
                .testCode(result.getLabTest().getTestCode())
                .testName(result.getTestName())
                .category(result.getLabTest().getCategory())
                .value(result.getValue())
                .unit(result.getUnit())
                .referenceRange(result.getReferenceRange())
                .interpretation(result.getInterpretation())
                .remarks(result.getRemarks())
                .isAbnormal(result.getIsAbnormal())
                .testDate(result.getTestDate())
                .performedBy(result.getPerformedBy())
                .build();
    }
}