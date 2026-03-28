package org.hms.modules.doctors.service;

import org.hms.common.exception.ResourceNotFoundException;
import org.hms.modules.auth.entity.User;
import org.hms.modules.auth.repository.UserRepository;
import org.hms.modules.doctors.dto.DoctorRequest;
import org.hms.modules.doctors.dto.DoctorResponse;
import org.hms.modules.doctors.entity.Doctor;
import org.hms.modules.doctors.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    @Transactional
    public DoctorResponse createDoctor(Long userId, DoctorRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (doctorRepository.existsByDoctorId(request.getDoctorId())) {
            throw new RuntimeException("Doctor ID already exists");
        }

        Doctor doctor = Doctor.builder()
                .user(user)
                .doctorId(request.getDoctorId())
                .specialization(request.getSpecialization())
                .qualification(request.getQualification())
                .yearsOfExperience(request.getYearsOfExperience())
                .licenseNumber(request.getLicenseNumber())
                .department(request.getDepartment())
                .consultationFee(request.getConsultationFee())
                .availableDays(request.getAvailableDays())
                .availableTimeFrom(request.getAvailableTimeFrom())
                .availableTimeTo(request.getAvailableTimeTo())
                .biography(request.getBiography())
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .build();

        Doctor savedDoctor = doctorRepository.save(doctor);
        return mapToResponse(savedDoctor);
    }

    @Transactional(readOnly = true)
    public DoctorResponse getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return mapToResponse(doctor);
    }

    @Transactional(readOnly = true)
    public DoctorResponse getDoctorByUserId(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found for user id: " + userId));
        return mapToResponse(doctor);
    }

    @Transactional(readOnly = true)
    public DoctorResponse getDoctorByDoctorId(String doctorId) {
        Doctor doctor = doctorRepository.findByDoctorId(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with doctor ID: " + doctorId));
        return mapToResponse(doctor);
    }

    @Transactional(readOnly = true)
    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DoctorResponse> getAvailableDoctors() {
        return doctorRepository.findByIsAvailableTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DoctorResponse> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DoctorResponse updateDoctor(Long id, DoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification());
        doctor.setYearsOfExperience(request.getYearsOfExperience());
        doctor.setLicenseNumber(request.getLicenseNumber());
        doctor.setDepartment(request.getDepartment());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setAvailableDays(request.getAvailableDays());
        doctor.setAvailableTimeFrom(request.getAvailableTimeFrom());
        doctor.setAvailableTimeTo(request.getAvailableTimeTo());
        doctor.setBiography(request.getBiography());

        if (request.getIsAvailable() != null) {
            doctor.setIsAvailable(request.getIsAvailable());
        }

        Doctor updatedDoctor = doctorRepository.save(doctor);
        return mapToResponse(updatedDoctor);
    }

    @Transactional
    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + id);
        }
        doctorRepository.deleteById(id);
    }

    @Transactional
    public DoctorResponse updateAvailability(Long id, Boolean isAvailable) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        doctor.setIsAvailable(isAvailable);
        Doctor updatedDoctor = doctorRepository.save(doctor);
        return mapToResponse(updatedDoctor);
    }

    private DoctorResponse mapToResponse(Doctor doctor) {
        User user = doctor.getUser();

        String fullName = user.getFullName() != null ? user.getFullName().trim() : "";
        String[] nameParts = fullName.isEmpty() ? new String[0] : fullName.split("\\s+", 2);

        String firstName = nameParts.length > 0 ? nameParts[0] : "";
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        return DoctorResponse.builder()
                .id(doctor.getId())
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(firstName)
                .lastName(lastName)
                .phoneNumber(user.getPhoneNumber())
                .doctorId(doctor.getDoctorId())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .yearsOfExperience(doctor.getYearsOfExperience())
                .licenseNumber(doctor.getLicenseNumber())
                .department(doctor.getDepartment())
                .consultationFee(doctor.getConsultationFee())
                .availableDays(doctor.getAvailableDays())
                .availableTimeFrom(doctor.getAvailableTimeFrom())
                .availableTimeTo(doctor.getAvailableTimeTo())
                .biography(doctor.getBiography())
                .isAvailable(doctor.getIsAvailable())
                .createdAt(doctor.getCreatedAt())
                .updatedAt(doctor.getUpdatedAt())
                .build();
    }
}