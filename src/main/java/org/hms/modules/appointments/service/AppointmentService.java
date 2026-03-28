package org.hms.modules.appointments.service;

import org.hms.common.exception.ResourceNotFoundException;
import org.hms.modules.appointments.dto.AppointmentRequest;
import org.hms.modules.appointments.dto.AppointmentResponse;
import org.hms.modules.appointments.dto.AppointmentUpdateRequest;
import org.hms.modules.appointments.entity.Appointment;
import org.hms.modules.appointments.entity.AppointmentStatus;
import org.hms.modules.appointments.repository.AppointmentRepository;
import org.hms.modules.doctors.entity.Doctor;
import org.hms.modules.doctors.repository.DoctorRepository;
import org.hms.modules.patients.entity.Patient;
import org.hms.modules.patients.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Transactional
    public AppointmentResponse createAppointment(AppointmentRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + request.getPatientId()));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));

        // Check doctor availability
        if (!doctor.getIsAvailable()) {
            throw new RuntimeException("Doctor is not available for appointments");
        }

        // Check if slot is available
        long appointmentCount = appointmentRepository.countAppointmentsByDoctorAndDate(
                doctor.getId(), request.getAppointmentDate());

        // Assuming maximum 20 appointments per day per doctor
        if (appointmentCount >= 20) {
            throw new RuntimeException("No available slots for this doctor on the selected date");
        }

        // Check for time conflicts
        List<Appointment> existingAppointments = appointmentRepository.findByDoctorAndDate(
                doctor.getId(), request.getAppointmentDate());

        for (Appointment existing : existingAppointments) {
            if (isTimeOverlap(request.getAppointmentTime(), request.getEndTime(),
                    existing.getAppointmentTime(), existing.getEndTime())) {
                throw new RuntimeException("Time slot conflicts with an existing appointment");
            }
        }

        Appointment appointment = Appointment.builder()
                .appointmentNumber(generateAppointmentNumber())
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .endTime(request.getEndTime() != null ? request.getEndTime() : request.getAppointmentTime().plusMinutes(30))
                .status(request.getStatus() != null ? request.getStatus() : AppointmentStatus.SCHEDULED)
                .reason(request.getReason())
                .notes(request.getNotes())
                .isFirstVisit(request.getIsFirstVisit() != null ? request.getIsFirstVisit() : false)
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapToResponse(savedAppointment);
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        return mapToResponse(appointment);
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getAppointmentByNumber(String appointmentNumber) {
        Appointment appointment = appointmentRepository.findByAppointmentNumber(appointmentNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with number: " + appointmentNumber));
        return mapToResponse(appointment);
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findPatientAppointments(patientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByStatus(AppointmentStatus status) {
        return appointmentRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponse updateAppointment(Long id, AppointmentUpdateRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        if (request.getAppointmentDate() != null) {
            appointment.setAppointmentDate(request.getAppointmentDate());
        }
        if (request.getAppointmentTime() != null) {
            appointment.setAppointmentTime(request.getAppointmentTime());
        }
        if (request.getEndTime() != null) {
            appointment.setEndTime(request.getEndTime());
        }
        if (request.getStatus() != null) {
            appointment.setStatus(request.getStatus());
        }
        if (request.getReason() != null) {
            appointment.setReason(request.getReason());
        }
        if (request.getNotes() != null) {
            appointment.setNotes(request.getNotes());
        }

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapToResponse(updatedAppointment);
    }

    @Transactional
    public AppointmentResponse cancelAppointment(Long id, String cancellationReason) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancellationReason(cancellationReason);

        Appointment cancelledAppointment = appointmentRepository.save(appointment);
        return mapToResponse(cancelledAppointment);
    }

    @Transactional
    public AppointmentResponse updateStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        appointment.setStatus(status);
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapToResponse(updatedAppointment);
    }

    @Transactional
    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found with id: " + id);
        }
        appointmentRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getTodayAppointments() {
        return appointmentRepository.findByAppointmentDate(LocalDate.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private boolean isTimeOverlap(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        if (end1 == null) end1 = start1.plusMinutes(30);
        if (end2 == null) end2 = start2.plusMinutes(30);

        return !(start1.isAfter(end2) || end1.isBefore(start2));
    }

    private String generateAppointmentNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmm"));
        String random = String.format("%04d", new Random().nextInt(10000));
        return "APT" + timestamp + random;
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        Patient patient = appointment.getPatient();
        Doctor doctor = appointment.getDoctor();

        return AppointmentResponse.builder()
                .id(appointment.getId())
                .appointmentNumber(appointment.getAppointmentNumber())
                .patientId(patient.getId())
                .patientName(patient.getUser().getFullName())
                .patientPhone(patient.getUser().getPhoneNumber())
                .doctorId(doctor.getId())
                .doctorName("Dr. " + doctor.getUser().getFullName())
                .doctorSpecialization(doctor.getSpecialization())
                .appointmentDate(appointment.getAppointmentDate())
                .appointmentTime(appointment.getAppointmentTime())
                .endTime(appointment.getEndTime())
                .status(appointment.getStatus())
                .reason(appointment.getReason())
                .notes(appointment.getNotes())
                .isFirstVisit(appointment.getIsFirstVisit())
                .createdAt(appointment.getCreatedAt())
                .updatedAt(appointment.getUpdatedAt())
                .build();
    }
}