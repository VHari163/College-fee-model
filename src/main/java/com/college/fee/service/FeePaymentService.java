package com.college.fee.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.college.fee.dto.FeePaymentRequest;
import com.college.fee.model.AcademicYear;
import com.college.fee.model.Course;
import com.college.fee.model.FeePayment;
import com.college.fee.model.FeeStructure;
import com.college.fee.model.FeeType;
import com.college.fee.model.Student;
import com.college.fee.repository.AcademicYearRepository;
import com.college.fee.repository.CourseRepository;
import com.college.fee.repository.FeePaymentRepository;
import com.college.fee.repository.FeeStructureRepository;
import com.college.fee.repository.FeeTypeRepository;
import com.college.fee.repository.StudentRepository;

@Service
public class FeePaymentService {

    private final FeePaymentRepository feePaymentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final AcademicYearRepository academicYearRepository;
    private final FeeTypeRepository feeTypeRepository;
    private final FeeStructureRepository feeStructureRepository;

    public FeePaymentService(
            FeePaymentRepository feePaymentRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            AcademicYearRepository academicYearRepository,
            FeeTypeRepository feeTypeRepository,
            FeeStructureRepository feeStructureRepository) {

        this.feePaymentRepository = feePaymentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.academicYearRepository = academicYearRepository;
        this.feeTypeRepository = feeTypeRepository;
        this.feeStructureRepository = feeStructureRepository;
    }

    // =========================================================
    // MAKE PAYMENT
    // =========================================================

    public FeePayment makePayment(FeePaymentRequest request) {

        // Find student
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        // Find academic year
        AcademicYear academicYear =
                academicYearRepository.findById(
                        request.getAcademicYearId())
                .orElseThrow(() ->
                        new RuntimeException("Academic year not found"));

        // Find fee type
        FeeType feeType =
                feeTypeRepository.findById(
                        request.getFeeTypeId())
                .orElseThrow(() ->
                        new RuntimeException("Fee type not found"));

        // Validate payment amount
        if (request.getAmount() == null ||
                request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Payment amount must be greater than zero");
        }

        // Validate student course
        if (student.getCourse() == null ||
                student.getCourse().isBlank()) {

            throw new RuntimeException(
                    "Student course is not configured");
        }

        // Find course
        Course course =
                courseRepository.findByCourseName(
                        student.getCourse())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student course not found"));

        // Find fee structure
        FeeStructure feeStructure =
                feeStructureRepository
                        .findByCourseCourseIdAndAcademicYearAcademicYearIdAndFeeTypeFeeTypeId(
                                course.getCourseId(),
                                academicYear.getAcademicYearId(),
                                feeType.getFeeTypeId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Fee structure not found"));

        // =====================================================
        // GET TOTAL AMOUNT ALREADY PAID
        // =====================================================

        BigDecimal totalPaid =
                feePaymentRepository.getTotalPaid(
                        student.getStudentId(),
                        academicYear.getAcademicYearId(),
                        feeType.getFeeTypeId());

        if (totalPaid == null) {
            totalPaid = BigDecimal.ZERO;
        }

        // =====================================================
        // CALCULATE REMAINING AMOUNT
        // =====================================================

        BigDecimal remainingAmount =
                feeStructure.getAmount().subtract(totalPaid);

        // =====================================================
        // PREVENT PAYMENT AFTER FULL PAYMENT
        // =====================================================

        if (remainingAmount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "This fee has already been fully paid");
        }

        // =====================================================
        // PREVENT OVERPAYMENT
        // =====================================================

        if (request.getAmount().compareTo(remainingAmount) > 0) {

            throw new RuntimeException(
                    "Payment amount cannot exceed remaining amount: ₹"
                    + remainingAmount);
        }

        // =====================================================
        // CREATE PAYMENT
        // =====================================================

        FeePayment payment = new FeePayment();

        payment.setStudent(student);
        payment.setAcademicYear(academicYear);
        payment.setFeeType(feeType);

        payment.setAmount(request.getAmount());

        payment.setPaymentDate(LocalDateTime.now());

        // Payment method
        if (request.getPaymentMethod() == null ||
                request.getPaymentMethod().isBlank()) {

            payment.setPaymentMethod("MOCK");

        } else {

            payment.setPaymentMethod(
                    request.getPaymentMethod());
        }

        // Generate transaction ID
        String transactionId =
                "TXN-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        payment.setTransactionId(transactionId);

        // Prototype payment status
        payment.setPaymentStatus("SUCCESS");

        payment.setRemarks(request.getRemarks());

        // Save payment
        return feePaymentRepository.save(payment);
    }

    // =========================================================
    // GET TOTAL PAID
    // =========================================================

    public BigDecimal getTotalPaid(
            Integer studentId,
            Integer academicYearId,
            Integer feeTypeId) {

        BigDecimal totalPaid =
                feePaymentRepository.getTotalPaid(
                        studentId,
                        academicYearId,
                        feeTypeId);

        return totalPaid == null
                ? BigDecimal.ZERO
                : totalPaid;
    }

    // =========================================================
    // GET REMAINING AMOUNT
    // =========================================================

    public BigDecimal getRemainingAmount(
            Integer studentId,
            Integer academicYearId,
            Integer feeTypeId) {

        // Find student
        Student student =
                studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found"));

        // Find academic year
        AcademicYear academicYear =
                academicYearRepository.findById(
                        academicYearId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Academic year not found"));

        // Find fee type
        FeeType feeType =
                feeTypeRepository.findById(
                        feeTypeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Fee type not found"));

        // Validate course
        if (student.getCourse() == null ||
                student.getCourse().isBlank()) {

            throw new RuntimeException(
                    "Student course is not configured");
        }

        // Find student's course
        Course course =
                courseRepository.findByCourseName(
                        student.getCourse())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student course not found"));

        // Find fee structure
        FeeStructure feeStructure =
                feeStructureRepository
                        .findByCourseCourseIdAndAcademicYearAcademicYearIdAndFeeTypeFeeTypeId(
                                course.getCourseId(),
                                academicYear.getAcademicYearId(),
                                feeType.getFeeTypeId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Fee structure not found"));

        // Get total paid
        BigDecimal totalPaid =
                feePaymentRepository.getTotalPaid(
                        studentId,
                        academicYearId,
                        feeTypeId);

        if (totalPaid == null) {
            totalPaid = BigDecimal.ZERO;
        }

        // Calculate remaining
        BigDecimal remainingAmount =
                feeStructure.getAmount().subtract(totalPaid);

        // Never return negative amount
        if (remainingAmount.compareTo(BigDecimal.ZERO) < 0) {

            remainingAmount = BigDecimal.ZERO;
        }

        return remainingAmount;
    }

    // =========================================================
    // GET ALL PAYMENTS
    // =========================================================

    public List<FeePayment> getAllPayments() {

        return feePaymentRepository.findAll();
    }

    // =========================================================
    // GET PAYMENTS BY STUDENT
    // =========================================================

    public List<FeePayment> getPaymentsByStudent(
            Integer studentId) {

        return feePaymentRepository
                .findByStudentStudentId(studentId);
    }
}