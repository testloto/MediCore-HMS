package org.hms.modules.pharmacy.service;

import org.hms.common.exception.ResourceNotFoundException;
import org.hms.modules.appointments.repository.AppointmentRepository;
import org.hms.modules.doctors.repository.DoctorRepository;
import org.hms.modules.patients.repository.PatientRepository;
import org.hms.modules.pharmacy.dto.*;
import org.hms.modules.pharmacy.entity.*;
import org.hms.modules.pharmacy.repository.MedicineRepository;
import org.hms.modules.pharmacy.repository.PrescriptionItemRepository;
import org.hms.modules.pharmacy.repository.PrescriptionRepository;
import org.hms.modules.pharmacy.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PharmacyService {

    private final MedicineRepository medicineRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;
    private final StockMovementRepository stockMovementRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    // Medicine Management
    @Transactional
    public MedicineResponse createMedicine(MedicineRequest request) {
        if (medicineRepository.existsByMedicineCode(request.getMedicineCode())) {
            throw new RuntimeException("Medicine with code " + request.getMedicineCode() + " already exists");
        }

        Medicine medicine = Medicine.builder()
                .medicineCode(request.getMedicineCode())
                .medicineName(request.getMedicineName())
                .genericName(request.getGenericName())
                .category(request.getCategory())
                .manufacturer(request.getManufacturer())
                .dosageForm(request.getDosageForm())
                .strength(request.getStrength())
                .unit(request.getUnit())
                .packSize(request.getPackSize())
                .unitPrice(request.getUnitPrice())
                .sellingPrice(request.getSellingPrice())
                .taxPercentage(request.getTaxPercentage() != null ? request.getTaxPercentage() : 0.0)
                .currentStock(request.getCurrentStock() != null ? request.getCurrentStock() : 0)
                .minimumStockLevel(request.getMinimumStockLevel() != null ? request.getMinimumStockLevel() : 10)
                .maximumStockLevel(request.getMaximumStockLevel())
                .reorderLevel(request.getReorderLevel() != null ? request.getReorderLevel() : 5)
                .locationInPharmacy(request.getLocationInPharmacy())
                .requiresPrescription(request.getRequiresPrescription() != null ? request.getRequiresPrescription() : true)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .expiryDate(request.getExpiryDate())
                .batchNumber(request.getBatchNumber())
                .description(request.getDescription())
                .sideEffects(request.getSideEffects())
                .contraindications(request.getContraindications())
                .build();

        Medicine savedMedicine = medicineRepository.save(medicine);
        return mapToMedicineResponse(savedMedicine);
    }

    @Transactional(readOnly = true)
    public MedicineResponse getMedicineById(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));
        return mapToMedicineResponse(medicine);
    }

    @Transactional(readOnly = true)
    public MedicineResponse getMedicineByCode(String medicineCode) {
        Medicine medicine = medicineRepository.findByMedicineCode(medicineCode)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with code: " + medicineCode));
        return mapToMedicineResponse(medicine);
    }

    @Transactional(readOnly = true)
    public List<MedicineResponse> getAllMedicines() {
        return medicineRepository.findAll().stream()
                .map(this::mapToMedicineResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedicineResponse> getActiveMedicines() {
        return medicineRepository.findByIsActiveTrue().stream()
                .map(this::mapToMedicineResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedicineResponse> getLowStockMedicines() {
        return medicineRepository.findLowStockMedicines().stream()
                .map(this::mapToMedicineResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedicineResponse> getNearExpiryMedicines(int days) {
        LocalDate expiryThreshold = LocalDate.now().plusDays(days);
        return medicineRepository.findNearExpiryMedicines(expiryThreshold).stream()
                .map(this::mapToMedicineResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MedicineResponse updateMedicine(Long id, MedicineRequest request) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));

        medicine.setMedicineName(request.getMedicineName());
        medicine.setGenericName(request.getGenericName());
        medicine.setCategory(request.getCategory());
        medicine.setManufacturer(request.getManufacturer());
        medicine.setDosageForm(request.getDosageForm());
        medicine.setStrength(request.getStrength());
        medicine.setUnit(request.getUnit());
        medicine.setPackSize(request.getPackSize());
        medicine.setUnitPrice(request.getUnitPrice());
        medicine.setSellingPrice(request.getSellingPrice());
        medicine.setTaxPercentage(request.getTaxPercentage());
        medicine.setMinimumStockLevel(request.getMinimumStockLevel());
        medicine.setMaximumStockLevel(request.getMaximumStockLevel());
        medicine.setReorderLevel(request.getReorderLevel());
        medicine.setLocationInPharmacy(request.getLocationInPharmacy());
        medicine.setRequiresPrescription(request.getRequiresPrescription());

        if (request.getIsActive() != null) {
            medicine.setIsActive(request.getIsActive());
        }

        medicine.setExpiryDate(request.getExpiryDate());
        medicine.setBatchNumber(request.getBatchNumber());
        medicine.setDescription(request.getDescription());
        medicine.setSideEffects(request.getSideEffects());
        medicine.setContraindications(request.getContraindications());

        Medicine updatedMedicine = medicineRepository.save(medicine);
        return mapToMedicineResponse(updatedMedicine);
    }

    @Transactional
    public void deleteMedicine(Long id) {
        if (!medicineRepository.existsById(id)) {
            throw new ResourceNotFoundException("Medicine not found with id: " + id);
        }
        medicineRepository.deleteById(id);
    }

    // Stock Management
    @Transactional
    public StockMovementResponse adjustStock(StockAdjustmentRequest request) {
        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + request.getMedicineId()));

        int previousStock = medicine.getCurrentStock();
        int newStock;

        switch (request.getMovementType()) {
            case RECEIVED:
                newStock = previousStock + request.getQuantity();
                break;
            case SOLD:
            case EXPIRED:
            case DAMAGED:
                newStock = previousStock - request.getQuantity();
                if (newStock < 0) {
                    throw new RuntimeException("Insufficient stock");
                }
                break;
            case ADJUSTED:
                newStock = request.getQuantity(); // Direct set for adjustment
                break;
            default:
                newStock = previousStock;
        }

        medicine.setCurrentStock(newStock);
        medicineRepository.save(medicine);

        StockMovement movement = StockMovement.builder()
                .medicine(medicine)
                .movementType(request.getMovementType())
                .quantity(request.getQuantity())
                .previousStock(previousStock)
                .newStock(newStock)
                .reason(request.getReason())
                .notes(request.getNotes())
                .performedBy(getCurrentUsername())
                .build();

        StockMovement savedMovement = stockMovementRepository.save(movement);
        return mapToStockMovementResponse(savedMovement);
    }

    @Transactional(readOnly = true)
    public List<StockMovementResponse> getMedicineStockMovements(Long medicineId) {
        return stockMovementRepository.findMedicineMovements(medicineId).stream()
                .map(this::mapToStockMovementResponse)
                .collect(Collectors.toList());
    }

    // Prescription Management
    @Transactional
    public PrescriptionResponse createPrescription(PrescriptionRequest request) {
        var patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + request.getPatientId()));

        var doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));

        var appointment = request.getAppointmentId() != null ?
                appointmentRepository.findById(request.getAppointmentId()).orElse(null) : null;

        Prescription prescription = Prescription.builder()
                .prescriptionNumber(generatePrescriptionNumber())
                .patient(patient)
                .doctor(doctor)
                .appointment(appointment)
                .prescriptionDate(request.getPrescriptionDate() != null ? request.getPrescriptionDate() : LocalDate.now())
                .validUntil(request.getValidUntil() != null ? request.getValidUntil() : LocalDate.now().plusMonths(3))
                .diagnosis(request.getDiagnosis())
                .notes(request.getNotes())
                .status(PrescriptionStatus.ACTIVE)
                .isDispensed(false)
                .build();

        Prescription savedPrescription = prescriptionRepository.save(prescription);

        double totalPrice = 0.0;
        for (PrescriptionItemRequest itemRequest : request.getItems()) {
            Medicine medicine = medicineRepository.findById(itemRequest.getMedicineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + itemRequest.getMedicineId()));

            PrescriptionItem item = PrescriptionItem.builder()
                    .prescription(savedPrescription)
                    .medicine(medicine)
                    .dosage(itemRequest.getDosage())
                    .frequency(itemRequest.getFrequency())
                    .duration(itemRequest.getDuration())
                    .durationUnit(itemRequest.getDurationUnit())
                    .instructions(itemRequest.getInstructions())
                    .quantity(itemRequest.getQuantity())
                    .quantityDispensed(0)
                    .unitPrice(medicine.getSellingPrice())
                    .isDispensed(false)
                    .refillsAuthorized(itemRequest.getRefillsAuthorized() != null ? itemRequest.getRefillsAuthorized() : 0)
                    .refillsUsed(0)
                    .build();

            prescriptionItemRepository.save(item);
            savedPrescription.getItems().add(item);
        }

        return mapToPrescriptionResponse(savedPrescription);
    }

    @Transactional(readOnly = true)
    public PrescriptionResponse getPrescriptionById(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));
        return mapToPrescriptionResponse(prescription);
    }

    @Transactional(readOnly = true)
    public PrescriptionResponse getPrescriptionByNumber(String prescriptionNumber) {
        Prescription prescription = prescriptionRepository.findByPrescriptionNumber(prescriptionNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with number: " + prescriptionNumber));
        return mapToPrescriptionResponse(prescription);
    }

    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getPrescriptionsByPatient(Long patientId) {
        return prescriptionRepository.findPatientPrescriptions(patientId).stream()
                .map(this::mapToPrescriptionResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getActivePrescriptionsByPatient(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId).stream()
                .filter(p -> p.getStatus() == PrescriptionStatus.ACTIVE)
                .map(this::mapToPrescriptionResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PrescriptionResponse dispensePrescription(DispenseRequest request) {
        Prescription prescription = prescriptionRepository.findById(request.getPrescriptionId())
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + request.getPrescriptionId()));

        if (prescription.getStatus() != PrescriptionStatus.ACTIVE) {
            throw new RuntimeException("Prescription is not active");
        }

        if (prescription.getValidUntil().isBefore(LocalDate.now())) {
            prescription.setStatus(PrescriptionStatus.EXPIRED);
            prescriptionRepository.save(prescription);
            throw new RuntimeException("Prescription has expired");
        }

        boolean allDispensed = true;
        boolean anyDispensed = false;

        for (DispenseItemRequest itemRequest : request.getItems()) {
            PrescriptionItem item = prescriptionItemRepository.findById(itemRequest.getPrescriptionItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Prescription item not found"));

            if (!item.getPrescription().getId().equals(prescription.getId())) {
                throw new RuntimeException("Item does not belong to this prescription");
            }

            if (item.getIsDispensed()) {
                continue;
            }

            Medicine medicine = item.getMedicine();
            int quantityToDispense = itemRequest.getQuantity();

            if (medicine.getCurrentStock() < quantityToDispense) {
                throw new RuntimeException("Insufficient stock for " + medicine.getMedicineName());
            }

            if (quantityToDispense > (item.getQuantity() - item.getQuantityDispensed())) {
                throw new RuntimeException("Cannot dispense more than prescribed quantity");
            }

            // Update medicine stock
            int previousStock = medicine.getCurrentStock();
            medicine.setCurrentStock(previousStock - quantityToDispense);
            medicineRepository.save(medicine);

            // Record stock movement
            StockMovement movement = StockMovement.builder()
                    .medicine(medicine)
                    .movementType(MovementType.SOLD)
                    .quantity(quantityToDispense)
                    .previousStock(previousStock)
                    .newStock(medicine.getCurrentStock())
                    .referenceNumber(prescription.getPrescriptionNumber())
                    .performedBy(getCurrentUsername())
                    .build();
            stockMovementRepository.save(movement);

            // Update prescription item
            item.setQuantityDispensed(item.getQuantityDispensed() + quantityToDispense);
            if (item.getQuantityDispensed() >= item.getQuantity()) {
                item.setIsDispensed(true);
            }
            prescriptionItemRepository.save(item);

            anyDispensed = true;
            if (!item.getIsDispensed()) {
                allDispensed = false;
            }
        }

        // Update prescription status
        if (allDispensed) {
            prescription.setStatus(PrescriptionStatus.DISPENSED);
            prescription.setIsDispensed(true);
        } else if (anyDispensed) {
            prescription.setStatus(PrescriptionStatus.PARTIALLY_DISPENSED);
        }

        prescription.setDispensedDate(LocalDateTime.now());
        prescription.setDispensedBy(getCurrentUsername());

        Prescription updatedPrescription = prescriptionRepository.save(prescription);
        return mapToPrescriptionResponse(updatedPrescription);
    }

    @Transactional
    public PrescriptionResponse cancelPrescription(Long id, String reason) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));

        prescription.setStatus(PrescriptionStatus.CANCELLED);
        prescription.setNotes(prescription.getNotes() + " [Cancelled: " + reason + "]");

        Prescription cancelledPrescription = prescriptionRepository.save(prescription);
        return mapToPrescriptionResponse(cancelledPrescription);
    }

    // Helper methods
    private String generatePrescriptionNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.format("%04d", new Random().nextInt(10000));
        return "RX" + timestamp + random;
    }

    private String getCurrentUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return principal.toString();
    }

    // Mapping methods
    private MedicineResponse mapToMedicineResponse(Medicine medicine) {
        boolean isLowStock = medicine.getCurrentStock() <= medicine.getReorderLevel();

        return MedicineResponse.builder()
                .id(medicine.getId())
                .medicineCode(medicine.getMedicineCode())
                .medicineName(medicine.getMedicineName())
                .genericName(medicine.getGenericName())
                .category(medicine.getCategory())
                .manufacturer(medicine.getManufacturer())
                .dosageForm(medicine.getDosageForm())
                .strength(medicine.getStrength())
                .unit(medicine.getUnit())
                .packSize(medicine.getPackSize())
                .unitPrice(medicine.getUnitPrice())
                .sellingPrice(medicine.getSellingPrice())
                .taxPercentage(medicine.getTaxPercentage())
                .currentStock(medicine.getCurrentStock())
                .minimumStockLevel(medicine.getMinimumStockLevel())
                .maximumStockLevel(medicine.getMaximumStockLevel())
                .reorderLevel(medicine.getReorderLevel())
                .locationInPharmacy(medicine.getLocationInPharmacy())
                .requiresPrescription(medicine.getRequiresPrescription())
                .isActive(medicine.getIsActive())
                .expiryDate(medicine.getExpiryDate())
                .batchNumber(medicine.getBatchNumber())
                .description(medicine.getDescription())
                .sideEffects(medicine.getSideEffects())
                .contraindications(medicine.getContraindications())
                .isLowStock(isLowStock)
                .createdAt(medicine.getCreatedAt())
                .updatedAt(medicine.getUpdatedAt())
                .build();
    }

    private PrescriptionResponse mapToPrescriptionResponse(Prescription prescription) {
        List<PrescriptionItemResponse> itemResponses = prescription.getItems().stream()
                .map(this::mapToPrescriptionItemResponse)
                .collect(Collectors.toList());

        return PrescriptionResponse.builder()
                .id(prescription.getId())
                .prescriptionNumber(prescription.getPrescriptionNumber())
                .patientId(prescription.getPatient().getId())
                .patientName(prescription.getPatient().getUser().getFullName())
                .patientIdNumber(prescription.getPatient().getPatientId())
                .doctorId(prescription.getDoctor().getId())
                .doctorName("Dr. " + prescription.getDoctor().getUser().getFullName())
                .appointmentId(prescription.getAppointment() != null ? prescription.getAppointment().getId() : null)
                .appointmentNumber(prescription.getAppointment() != null ? prescription.getAppointment().getAppointmentNumber() : null)
                .prescriptionDate(prescription.getPrescriptionDate())
                .validUntil(prescription.getValidUntil())
                .diagnosis(prescription.getDiagnosis())
                .notes(prescription.getNotes())
                .status(prescription.getStatus())
                .isDispensed(prescription.getIsDispensed())
                .dispensedDate(prescription.getDispensedDate())
                .dispensedBy(prescription.getDispensedBy())
                .items(itemResponses)
                .createdAt(prescription.getCreatedAt())
                .updatedAt(prescription.getUpdatedAt())
                .build();
    }

    private PrescriptionItemResponse mapToPrescriptionItemResponse(PrescriptionItem item) {
        double totalPrice = item.getUnitPrice() * item.getQuantityDispensed();

        return PrescriptionItemResponse.builder()
                .id(item.getId())
                .medicineId(item.getMedicine().getId())
                .medicineCode(item.getMedicine().getMedicineCode())
                .medicineName(item.getMedicine().getMedicineName())
                .dosage(item.getDosage())
                .frequency(item.getFrequency())
                .duration(item.getDuration())
                .durationUnit(item.getDurationUnit())
                .instructions(item.getInstructions())
                .quantity(item.getQuantity())
                .quantityDispensed(item.getQuantityDispensed())
                .unitPrice(item.getUnitPrice())
                .totalPrice(totalPrice)
                .isDispensed(item.getIsDispensed())
                .refillsAuthorized(item.getRefillsAuthorized())
                .refillsUsed(item.getRefillsUsed())
                .build();
    }

    private StockMovementResponse mapToStockMovementResponse(StockMovement movement) {
        return StockMovementResponse.builder()
                .id(movement.getId())
                .medicineId(movement.getMedicine().getId())
                .medicineName(movement.getMedicine().getMedicineName())
                .medicineCode(movement.getMedicine().getMedicineCode())
                .movementType(movement.getMovementType())
                .quantity(movement.getQuantity())
                .previousStock(movement.getPreviousStock())
                .newStock(movement.getNewStock())
                .referenceNumber(movement.getReferenceNumber())
                .reason(movement.getReason())
                .performedBy(movement.getPerformedBy())
                .notes(movement.getNotes())
                .createdAt(movement.getCreatedAt())
                .build();
    }
}