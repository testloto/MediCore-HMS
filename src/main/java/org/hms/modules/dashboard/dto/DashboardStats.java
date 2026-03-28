package org.hms.modules.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private Long totalPatients;
    private Long totalDoctors;
    private Long totalAppointments;
    private Long totalStaff;
    private Long todayAppointments;
    private Long pendingAppointments;
    private Long completedAppointments;
    private Long cancelledAppointments;

    private Double todayRevenue;
    private Double weeklyRevenue;
    private Double monthlyRevenue;
    private Double pendingPayments;

    private Map<String, Long> appointmentsByStatus;
    private Map<String, Long> patientsByMonth;
    private Map<String, Double> revenueByMonth;
    private Map<String, Long> doctorsBySpecialization;
}