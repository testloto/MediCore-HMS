package org.hms.modules.laboratory.entity;

public enum LabRequestStatus {
    PENDING,
    SAMPLE_PENDING,
    SAMPLE_COLLECTED,
    IN_PROGRESS,
    COMPLETED,
    REVIEWED,
    CANCELLED
}