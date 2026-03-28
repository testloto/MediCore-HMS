package org.hms.modules.billing.repository;

import org.hms.modules.billing.entity.Invoice;
import org.hms.modules.billing.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    List<Invoice> findByPatientId(Long patientId);

    List<Invoice> findByPaymentStatus(PaymentStatus status);

    @Query("SELECT i FROM Invoice i WHERE i.invoiceDate BETWEEN :startDate AND :endDate")
    List<Invoice> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                  @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(i.total) FROM Invoice i WHERE i.paymentStatus = 'PAID' AND i.invoiceDate BETWEEN :startDate AND :endDate")
    Double getTotalRevenue(@Param("startDate") LocalDateTime startDate,
                           @Param("endDate") LocalDateTime endDate);

    @Query("SELECT i FROM Invoice i WHERE i.patient.id = :patientId AND i.paymentStatus != 'PAID'")
    List<Invoice> findPendingInvoicesByPatient(@Param("patientId") Long patientId);
}