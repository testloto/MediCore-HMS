package org.hms.modules.pharmacy.repository;

import org.hms.modules.pharmacy.entity.MovementType;
import org.hms.modules.pharmacy.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByMedicineId(Long medicineId);

    List<StockMovement> findByMovementType(MovementType movementType);

    @Query("SELECT sm FROM StockMovement sm WHERE sm.createdAt BETWEEN :startDate AND :endDate")
    List<StockMovement> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                        @Param("endDate") LocalDateTime endDate);

    @Query("SELECT sm FROM StockMovement sm WHERE sm.medicine.id = :medicineId ORDER BY sm.createdAt DESC")
    List<StockMovement> findMedicineMovements(@Param("medicineId") Long medicineId);
}