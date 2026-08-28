package com.college.fee.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.college.fee.dto.FeePaymentRequest;
import com.college.fee.model.AcademicYear;
import com.college.fee.model.FeePayment;
import com.college.fee.model.FeeStructure;
import com.college.fee.model.FeeType;
import com.college.fee.model.Student;
import com.college.fee.repository.AcademicYearRepository;
import com.college.fee.repository.FeePaymentRepository;
import com.college.fee.repository.FeeStructureRepository;
import com.college.fee.repository.FeeTypeRepository;
import com.college.fee.repository.StudentRepository;

@Service
public class FeePaymentService {

    private final FeePaymentRepository feePaymentRepository;
    private final StudentRepository studentRepository;
    private final AcademicYearRepository academicYearRepository;
    private final FeeTypeRepository feeTypeRepository;
    private final FeeStructureRepository feeStructureRepository;

    public FeePaymentService(
            FeePaymentRepository feePaymentRepository,
            StudentRepository studentRepository,
            AcademicYearRepository academicYearRepository,
            FeeTypeRepository feeTypeRepository,
            FeeStructureRepository feeStructureRepository) {

        this.feePaymentRepository = feePaymentRepository;
        this.studentRepository = studentRepository;
        this.academicYearRepository = academicYearRepository;
        this.feeTypeRepository = feeTypeRepository;
        this.feeStructureRepository = feeStructureRepository;
    }

    public FeePayment makePayment(FeePaymentRequest request) {

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        AcademicYear academicYear =
                academicYearRepository.findById(request.getAcademicYearId())
                        .orElseThrow(() -> new RuntimeException("Academic year not found"));

        FeeType feeType =
                feeTypeRepository.findById(request.getFeeTypeId())
                        .orElseThrow(() -> new RuntimeException("Fee type not found"));

        FeeStructure feeStructure = feeStructureRepository
                .findAll()
                .stream()
                .filter(fs ->
                        fs.getCourse().getCourseId()
                                .equals(student.getCourse() != null ? 0 : 0))
                .findFirst()
                .orElse(null);

        /*
         * For the first prototype, we will use the fee amount
         * already defined in the fee structure.
         *
         * This logic will be refined in the next step to find
         * the exact fee structure for this student's course,
         * academic year and fee type.
         */

        if (feeStructure == null) {
            throw new RuntimeException("Fee structure not found");
        }

        BigDecimal amount = feeStructure.getAmount();

        FeePayment payment = new FeePayment();

        payment.setStudent(student);
        payment.setAcademicYear(academicYear);
        payment.setFeeType(feeType);
        payment.setAmount(amount);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(request.getPaymentMethod());

        payment.setTransactionId(
                "TXN-" + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase()
        );

        payment.setPaymentStatus("SUCCESS");
        payment.setRemarks(request.getRemarks());

        return feePaymentRepository.save(payment);
    }

    public List<FeePayment> getAllPayments() {
        return feePaymentRepository.findAll();
    }
}