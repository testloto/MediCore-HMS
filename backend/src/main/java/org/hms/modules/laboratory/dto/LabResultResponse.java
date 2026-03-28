package org.hms.modules.laboratory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabResultResponse {
    private Long id;
    private Long labTestId;
    private String testCode;
    private String testName;
    private String category;
    private String value;
    private String unit;
    private String referenceRange;
    private String interpretation;
    private String remarks;
    private Boolean isAbnormal;
    private LocalDateTime testDate;
    private String performedBy;
}