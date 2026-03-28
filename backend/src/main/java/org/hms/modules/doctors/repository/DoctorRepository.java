package org.hms.modules.doctors.repository;

import org.hms.modules.doctors.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByDoctorId(String doctorId);
    Optional<Doctor> findByUserId(Long userId);
    boolean existsByDoctorId(String doctorId);

    List<Doctor> findBySpecialization(String specialization);
    List<Doctor> findByDepartment(String department);
    List<Doctor> findByIsAvailableTrue();

    @Query("SELECT d FROM Doctor d WHERE d.specialization LIKE %:keyword% OR d.department LIKE %:keyword%")
    List<Doctor> searchDoctors(@Param("keyword") String keyword);
}