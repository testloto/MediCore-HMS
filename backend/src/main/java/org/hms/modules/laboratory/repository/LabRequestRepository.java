package org.hms.modules.laboratory.repository;

import org.hms.modules.laboratory.entity.LabRequest;
import org.hms.modules.laboratory.entity.LabRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LabRequestRepository extends JpaRepository<LabRequest, Long> {
    Optional<LabRequest> findByRequestNumber(String requestNumber);

    List<LabRequest> findByPatientId(Long patientId);

    List<LabRequest> findByDoctorId(Long doctorId);

    List<LabRequest> findByStatus(LabRequestStatus status);

    @Query("SELECT lr FROM LabRequest lr WHERE lr.patient.id = :patientId ORDER BY lr.requestDate DESC")
    List<LabRequest> findPatientLabRequests(@Param("patientId") Long patientId);

    @Query("SELECT lr FROM LabRequest lr WHERE lr.status = :status AND lr.isUrgent = true")
    List<LabRequest> findUrgentByStatus(@Param("status") LabRequestStatus status);

    @Query("SELECT lr FROM LabRequest lr WHERE lr.requestDate BETWEEN :startDate AND :endDate")
    List<LabRequest> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                     @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(lr) FROM LabRequest lr WHERE lr.status = :status")
    Long countByStatus(@Param("status") LabRequestStatus status);
}