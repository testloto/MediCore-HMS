package org.hms.modules.dashboard.service;

import org.hms.modules.appointments.entity.AppointmentStatus;
import org.hms.modules.appointments.repository.AppointmentRepository;
import org.hms.modules.billing.entity.PaymentStatus;
import org.hms.modules.billing.repository.InvoiceRepository;
import org.hms.modules.dashboard.dto.DashboardStats;
import org.hms.modules.doctors.repository.DoctorRepository;
import org.hms.modules.patients.repository.PatientRepository;
import org.hms.modules.staff.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final StaffRepository staffRepository;
    private final InvoiceRepository invoiceRepository;

    public DashboardStats getDashboardStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = now.toLocalDate().atTime(LocalTime.MAX);

        LocalDateTime startOfWeek = now.minusDays(7);
        LocalDateTime startOfMonth = now.minusDays(30);

        // Basic counts
        Long totalPatients = patientRepository.count();
        Long totalDoctors = doctorRepository.count();
        Long totalAppointments = appointmentRepository.count();
        Long totalStaff = staffRepository.count();

        // Appointments by status
        Long todayAppointments = (long) appointmentRepository.findByAppointmentDate(LocalDate.now()).size();
        Long pendingAppointments = (long) appointmentRepository.findByStatus(AppointmentStatus.SCHEDULED).size();
        Long completedAppointments = (long) appointmentRepository.findByStatus(AppointmentStatus.COMPLETED).size();
        Long cancelledAppointments = (long) appointmentRepository.findByStatus(AppointmentStatus.CANCELLED).size();

        // Revenue stats
        Double todayRevenue = invoiceRepository.getTotalRevenue(startOfDay, endOfDay);
        Double weeklyRevenue = invoiceRepository.getTotalRevenue(startOfWeek, now);
        Double monthlyRevenue = invoiceRepository.getTotalRevenue(startOfMonth, now);

        Double pendingPayments = invoiceRepository.findByPaymentStatus(PaymentStatus.PENDING).stream()
                .mapToDouble(invoice -> invoice.getBalanceDue())
                .sum();

        // Appointments by status map
        Map<String, Long> appointmentsByStatus = new HashMap<>();
        for (AppointmentStatus status : AppointmentStatus.values()) {
            Long count = (long) appointmentRepository.findByStatus(status).size();
            appointmentsByStatus.put(status.name(), count);
        }

        // Patients by month (last 6 months)
        Map<String, Long> patientsByMonth = new HashMap<>();
        // This would need a custom query - placeholder for now
        patientsByMonth.put("Last 6 months", 0L);

        // Revenue by month (last 6 months)
        Map<String, Double> revenueByMonth = new HashMap<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth yearMonth = YearMonth.now().minusMonths(i);
            LocalDateTime start = yearMonth.atDay(1).atStartOfDay();
            LocalDateTime end = yearMonth.atEndOfMonth().atTime(LocalTime.MAX);
            Double revenue = invoiceRepository.getTotalRevenue(start, end);
            revenueByMonth.put(yearMonth.toString(), revenue != null ? revenue : 0.0);
        }

        // Doctors by specialization
        Map<String, Long> doctorsBySpecialization = new HashMap<>();
        doctorRepository.findAll().forEach(doctor -> {
            String spec = doctor.getSpecialization();
            doctorsBySpecialization.put(spec, doctorsBySpecialization.getOrDefault(spec, 0L) + 1);
        });

        return DashboardStats.builder()
                .totalPatients(totalPatients)
                .totalDoctors(totalDoctors)
                .totalAppointments(totalAppointments)
                .totalStaff(totalStaff)
                .todayAppointments(todayAppointments)
                .pendingAppointments(pendingAppointments)
                .completedAppointments(completedAppointments)
                .cancelledAppointments(cancelledAppointments)
                .todayRevenue(todayRevenue != null ? todayRevenue : 0.0)
                .weeklyRevenue(weeklyRevenue != null ? weeklyRevenue : 0.0)
                .monthlyRevenue(monthlyRevenue != null ? monthlyRevenue : 0.0)
                .pendingPayments(pendingPayments)
                .appointmentsByStatus(appointmentsByStatus)
                .patientsByMonth(patientsByMonth)
                .revenueByMonth(revenueByMonth)
                .doctorsBySpecialization(doctorsBySpecialization)
                .build();
    }
}