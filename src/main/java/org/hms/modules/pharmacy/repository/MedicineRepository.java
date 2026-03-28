package org.hms.modules.pharmacy.repository;

import org.hms.modules.pharmacy.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    Optional<Medicine> findByMedicineCode(String medicineCode);

    List<Medicine> findByCategory(String category);

    List<Medicine> findByManufacturer(String manufacturer);

    @Query("SELECT m FROM Medicine m WHERE m.currentStock <= m.reorderLevel")
    List<Medicine> findLowStockMedicines();

    @Query("SELECT m FROM Medicine m WHERE m.expiryDate <= :date")
    List<Medicine> findNearExpiryMedicines(@Param("date") LocalDate date);

    @Query("SELECT m FROM Medicine m WHERE m.medicineName LIKE %:keyword% OR m.genericName LIKE %:keyword%")
    List<Medicine> searchMedicines(@Param("keyword") String keyword);

    List<Medicine> findByRequiresPrescriptionTrue();

    List<Medicine> findByIsActiveTrue();

    boolean existsByMedicineCode(String medicineCode);
}