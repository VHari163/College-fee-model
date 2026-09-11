package com.college.fee.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.college.fee.dto.FeePaymentRequest;
import com.college.fee.model.FeePayment;
import com.college.fee.service.FeePaymentService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class FeePaymentController {

    private final FeePaymentService feePaymentService;

    public FeePaymentController(
            FeePaymentService feePaymentService) {

        this.feePaymentService = feePaymentService;
    }

    // =====================================================
    // MAKE PAYMENT
    // =====================================================

    @PostMapping
    public ResponseEntity<FeePayment> makePayment(
            @RequestBody FeePaymentRequest request) {

        return ResponseEntity.ok(
                feePaymentService.makePayment(request)
        );
    }


    // =====================================================
    // GET ALL PAYMENTS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<FeePayment>> getAllPayments() {

        return ResponseEntity.ok(
                feePaymentService.getAllPayments()
        );
    }


    // =====================================================
    // GET PAYMENTS BY STUDENT
    // =====================================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<FeePayment>> getStudentPayments(
            @PathVariable Integer studentId) {

        return ResponseEntity.ok(
                feePaymentService.getPaymentsByStudent(studentId)
        );
    }


    // =====================================================
    // GET TOTAL PAID
    // =====================================================

    @GetMapping("/paid")
    public ResponseEntity<BigDecimal> getTotalPaid(
            @RequestParam Integer studentId,
            @RequestParam Integer academicYearId,
            @RequestParam Integer feeTypeId) {

        return ResponseEntity.ok(
                feePaymentService.getTotalPaid(
                        studentId,
                        academicYearId,
                        feeTypeId
                )
        );
    }


    // =====================================================
    // GET REMAINING AMOUNT
    // =====================================================

    @GetMapping("/remaining")
    public ResponseEntity<BigDecimal> getRemainingAmount(
            @RequestParam Integer studentId,
            @RequestParam Integer academicYearId,
            @RequestParam Integer feeTypeId) {

        return ResponseEntity.ok(
                feePaymentService.getRemainingAmount(
                        studentId,
                        academicYearId,
                        feeTypeId
                )
        );
    }
}