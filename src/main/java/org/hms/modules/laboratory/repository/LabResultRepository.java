package org.hms.modules.laboratory.repository;

import org.hms.modules.laboratory.entity.LabResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabResultRepository extends JpaRepository<LabResult, Long> {
    List<LabResult> findByLabRequestId(Long labRequestId);

    List<LabResult> findByLabTestId(Long labTestId);

    List<LabResult> findByIsAbnormalTrue();
}