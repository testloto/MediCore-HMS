package org.hms.modules.patients.repository;

import org.hms.modules.patients.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByPatientId(String patientId);
    Optional<Patient> findByUserId(Long userId);
    boolean existsByPatientId(String patientId);
}