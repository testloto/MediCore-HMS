package org.hms.modules.doctors.entity;

import org.hms.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "doctors")
@EntityListeners(AuditingEntityListener.class)
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "doctor_id", unique = true, nullable = false)
    private String doctorId;

    private String specialization;

    private String qualification;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    private String licenseNumber;

    private String department;

    @Column(name = "consultation_fee")
    private Double consultationFee;

    @ElementCollection
    @CollectionTable(name = "doctor_available_days", joinColumns = @JoinColumn(name = "doctor_id"))
    @Column(name = "available_day")
    private List<String> availableDays;

    @Column(name = "available_time_from")
    private String availableTimeFrom;

    @Column(name = "available_time_to")
    private String availableTimeTo;

    private String biography;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}