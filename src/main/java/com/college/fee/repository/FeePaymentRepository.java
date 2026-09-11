package com.college.fee.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.college.fee.model.FeePayment;

public interface FeePaymentRepository extends JpaRepository<FeePayment, Integer> {

    List<FeePayment> findByStudentStudentId(Integer studentId);

    @Query("""
        SELECT COALESCE(SUM(p.amount), 0)
        FROM FeePayment p
        WHERE p.student.studentId = :studentId
          AND p.academicYear.academicYearId = :academicYearId
          AND p.feeType.feeTypeId = :feeTypeId
          AND p.paymentStatus = 'SUCCESS'
    """)
    BigDecimal getTotalPaid(
            @Param("studentId") Integer studentId,
            @Param("academicYearId") Integer academicYearId,
            @Param("feeTypeId") Integer feeTypeId
    );
}