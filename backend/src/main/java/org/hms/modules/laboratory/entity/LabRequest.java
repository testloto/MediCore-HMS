package org.hms.modules.laboratory.entity;

import org.hms.modules.patients.entity.Patient;
import org.hms.modules.doctors.entity.Doctor;
import org.hms.modules.appointments.entity.Appointment;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "lab_requests")
@EntityListeners(AuditingEntityListener.class)
public class LabRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_number", unique = true, nullable = false)
    private String requestNumber;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(name = "request_date", nullable = false)
    private LocalDateTime requestDate;

    @Column(name = "requested_by")
    private String requestedBy;

    @Enumerated(EnumType.STRING)
    private LabRequestStatus status;

    @Column(name = "clinical_notes", columnDefinition = "TEXT")
    private String clinicalNotes;

    @Column(name = "diagnosis")
    private String diagnosis;

    @Column(name = "is_urgent")
    private Boolean isUrgent = false;

    @Column(name = "sample_collected_date")
    private LocalDateTime sampleCollectedDate;

    @Column(name = "sample_collected_by")
    private String sampleCollectedBy;

    @Column(name = "sample_type")
    private String sampleType;

    @Column(name = "sample_notes")
    private String sampleNotes;

    @Column(name = "result_date")
    private LocalDateTime resultDate;

    @Column(name = "result_entered_by")
    private String resultEnteredBy;

    @Column(name = "result_approved_by")
    private String resultApprovedBy;

    @Column(name = "result_approved_date")
    private LocalDateTime resultApprovedDate;

    @Column(name = "report_html", columnDefinition = "TEXT")
    private String reportHtml;

    @Column(name = "report_pdf_path")
    private String reportPdfPath;

    private String notes;

    @OneToMany(mappedBy = "labRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LabResult> results = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}