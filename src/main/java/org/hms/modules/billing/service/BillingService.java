package org.hms.modules.billing.service;

import org.hms.common.exception.ResourceNotFoundException;
import org.hms.modules.appointments.entity.Appointment;
import org.hms.modules.appointments.repository.AppointmentRepository;
import org.hms.modules.billing.dto.InvoiceItemRequest;
import org.hms.modules.billing.dto.InvoiceItemResponse;
import org.hms.modules.billing.dto.InvoiceRequest;
import org.hms.modules.billing.dto.InvoiceResponse;
import org.hms.modules.billing.dto.PaymentRequest;
import org.hms.modules.billing.entity.Invoice;
import org.hms.modules.billing.entity.InvoiceItem;
import org.hms.modules.billing.entity.PaymentMethod;
import org.hms.modules.billing.entity.PaymentStatus;
import org.hms.modules.billing.repository.InvoiceRepository;
import org.hms.modules.patients.entity.Patient;
import org.hms.modules.patients.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final InvoiceRepository invoiceRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    @Transactional
    public InvoiceResponse createInvoice(InvoiceRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + request.getPatientId()));

        Appointment appointment = null;
        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + request.getAppointmentId()));
        }

        Invoice invoice = Invoice.builder()
                .invoiceNumber(generateInvoiceNumber())
                .patient(patient)
                .appointment(appointment)
                .invoiceDate(LocalDateTime.now())
                .dueDate(request.getDueDate() != null ? request.getDueDate() : LocalDateTime.now().plusDays(30))
                .taxRate(request.getTaxRate() != null ? request.getTaxRate() : 0.0)
                .discount(request.getDiscount() != null ? request.getDiscount() : 0.0)
                .discountType(request.getDiscountType())
                .paymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : PaymentStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .notes(request.getNotes())
                .amountPaid(0.0)
                .build();

        // Calculate totals
        double subtotal = 0.0;
        for (InvoiceItemRequest itemRequest : request.getItems()) {
            InvoiceItem item = InvoiceItem.builder()
                    .invoice(invoice)
                    .description(itemRequest.getDescription())
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(itemRequest.getUnitPrice())
                    .amount(itemRequest.getQuantity() * itemRequest.getUnitPrice())
                    .itemType(itemRequest.getItemType())
                    .referenceId(itemRequest.getReferenceId())
                    .build();
            invoice.getItems().add(item);
            subtotal += item.getAmount();
        }

        invoice.setSubtotal(subtotal);

        // Apply discount
        double discountAmount = 0.0;
        if (invoice.getDiscount() > 0) {
            if ("PERCENTAGE".equalsIgnoreCase(invoice.getDiscountType())) {
                discountAmount = subtotal * (invoice.getDiscount() / 100);
            } else {
                discountAmount = invoice.getDiscount();
            }
        }

        // Calculate tax
        double taxableAmount = subtotal - discountAmount;
        double taxAmount = taxableAmount * (invoice.getTaxRate() / 100);

        invoice.setTax(taxAmount);
        invoice.setTotal(taxableAmount + taxAmount);
        invoice.setBalanceDue(invoice.getTotal());

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return mapToResponse(savedInvoice);
    }

    @Transactional
    public InvoiceResponse processPayment(PaymentRequest request) {
        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + request.getInvoiceId()));

        double newAmountPaid = invoice.getAmountPaid() + request.getAmount();
        double newBalanceDue = invoice.getTotal() - newAmountPaid;

        invoice.setAmountPaid(newAmountPaid);
        invoice.setBalanceDue(newBalanceDue);

        // Update payment status
        if (newBalanceDue <= 0) {
            invoice.setPaymentStatus(PaymentStatus.PAID);
        } else if (newAmountPaid > 0) {
            invoice.setPaymentStatus(PaymentStatus.PARTIALLY_PAID);
        }

        invoice.setPaymentMethod(request.getPaymentMethod());

        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return mapToResponse(updatedInvoice);
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
        return mapToResponse(invoice);
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceByNumber(String invoiceNumber) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with number: " + invoiceNumber));
        return mapToResponse(invoice);
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByPatient(Long patientId) {
        return invoiceRepository.findByPatientId(patientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getPendingInvoicesByPatient(Long patientId) {
        return invoiceRepository.findPendingInvoicesByPatient(patientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByStatus(PaymentStatus status) {
        return invoiceRepository.findByPaymentStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Double getRevenueBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        Double revenue = invoiceRepository.getTotalRevenue(startDate, endDate);
        return revenue != null ? revenue : 0.0;
    }

    private String generateInvoiceNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.format("%04d", new Random().nextInt(10000));
        return "INV" + timestamp + random;
    }

    private InvoiceResponse mapToResponse(Invoice invoice) {
        Patient patient = invoice.getPatient();
        Appointment appointment = invoice.getAppointment();

        List<InvoiceItemResponse> itemResponses = invoice.getItems().stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList());

        return InvoiceResponse.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .patientId(patient.getId())
                .patientName(patient.getUser().getFullName())
                .patientPhone(patient.getUser().getPhoneNumber())
                .appointmentId(appointment != null ? appointment.getId() : null)
                .appointmentNumber(appointment != null ? appointment.getAppointmentNumber() : null)
                .invoiceDate(invoice.getInvoiceDate())
                .dueDate(invoice.getDueDate())
                .items(itemResponses)
                .subtotal(invoice.getSubtotal())
                .tax(invoice.getTax())
                .taxRate(invoice.getTaxRate())
                .discount(invoice.getDiscount())
                .discountType(invoice.getDiscountType())
                .total(invoice.getTotal())
                .amountPaid(invoice.getAmountPaid())
                .balanceDue(invoice.getBalanceDue())
                .paymentStatus(invoice.getPaymentStatus())
                .paymentMethod(invoice.getPaymentMethod())
                .notes(invoice.getNotes())
                .createdAt(invoice.getCreatedAt())
                .updatedAt(invoice.getUpdatedAt())
                .build();
    }

    private InvoiceItemResponse mapItemToResponse(InvoiceItem item) {
        return InvoiceItemResponse.builder()
                .id(item.getId())
                .description(item.getDescription())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .amount(item.getAmount())
                .itemType(item.getItemType())
                .referenceId(item.getReferenceId())
                .build();
    }
}