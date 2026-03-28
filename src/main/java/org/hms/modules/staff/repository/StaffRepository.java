package org.hms.modules.staff.repository;

import org.hms.modules.staff.entity.Staff;
import org.hms.modules.staff.entity.StaffDepartment;
import org.hms.modules.staff.entity.StaffPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByStaffId(String staffId);

    Optional<Staff> findByUserId(Long userId);

    List<Staff> findByDepartment(StaffDepartment department);

    List<Staff> findByPosition(StaffPosition position);

    List<Staff> findByIsActiveTrue();

    @Query("SELECT s FROM Staff s WHERE s.department = :department AND s.isActive = true")
    List<Staff> findActiveByDepartment(@Param("department") StaffDepartment department);

    // Fix: Search by user's first name, last name, and staff ID
    @Query("SELECT s FROM Staff s WHERE " +
            "LOWER(s.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.staffId) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Staff> searchStaff(@Param("keyword") String keyword);

    boolean existsByStaffId(String staffId);
}