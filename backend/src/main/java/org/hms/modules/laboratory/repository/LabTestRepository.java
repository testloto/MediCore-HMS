package org.hms.modules.laboratory.repository;

import org.hms.modules.laboratory.entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LabTestRepository extends JpaRepository<LabTest, Long> {
    Optional<LabTest> findByTestCode(String testCode);

    List<LabTest> findByCategory(String category);

    List<LabTest> findByIsActiveTrue();

    @Query("SELECT lt FROM LabTest lt WHERE lt.testName LIKE %:keyword% OR lt.testCode LIKE %:keyword%")
    List<LabTest> searchLabTests(@Param("keyword") String keyword);

    boolean existsByTestCode(String testCode);
}