package com.college.fee.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.college.fee.dto.FeeStructureRequest;
import com.college.fee.model.AcademicYear;
import com.college.fee.model.Course;
import com.college.fee.model.FeeStructure;
import com.college.fee.model.FeeType;
import com.college.fee.repository.AcademicYearRepository;
import com.college.fee.repository.CourseRepository;
import com.college.fee.repository.FeeStructureRepository;
import com.college.fee.repository.FeeTypeRepository;

@Service
public class FeeStructureService {

    private final FeeStructureRepository feeStructureRepository;
    private final CourseRepository courseRepository;
    private final AcademicYearRepository academicYearRepository;
    private final FeeTypeRepository feeTypeRepository;

    public FeeStructureService(
            FeeStructureRepository feeStructureRepository,
            CourseRepository courseRepository,
            AcademicYearRepository academicYearRepository,
            FeeTypeRepository feeTypeRepository
    ) {
        this.feeStructureRepository = feeStructureRepository;
        this.courseRepository = courseRepository;
        this.academicYearRepository = academicYearRepository;
        this.feeTypeRepository = feeTypeRepository;
    }


    // =====================================================
    // ADD FEE STRUCTURE
    // =====================================================

    public FeeStructure addFeeStructure(
            FeeStructureRequest request
    ) {

        if (request.getCourseId() == null) {
            throw new RuntimeException(
                    "Course is required"
            );
        }

        if (request.getAcademicYearId() == null) {
            throw new RuntimeException(
                    "Academic year is required"
            );
        }

        if (request.getFeeTypeId() == null) {
            throw new RuntimeException(
                    "Fee type is required"
            );
        }

        if (request.getAmount() == null ||
                request.getAmount().signum() <= 0) {

            throw new RuntimeException(
                    "Amount must be greater than zero"
            );
        }


        Course course =
                courseRepository.findById(
                        request.getCourseId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Course not found"
                        )
                );


        AcademicYear academicYear =
                academicYearRepository.findById(
                        request.getAcademicYearId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Academic year not found"
                        )
                );


        FeeType feeType =
                feeTypeRepository.findById(
                        request.getFeeTypeId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Fee type not found"
                        )
                );


        // Prevent duplicate structure

        var existing =
                feeStructureRepository
                        .findByCourseCourseIdAndAcademicYearAcademicYearIdAndFeeTypeFeeTypeId(
                                course.getCourseId(),
                                academicYear.getAcademicYearId(),
                                feeType.getFeeTypeId()
                        );


        if (existing.isPresent()) {

            throw new RuntimeException(
                    "A fee structure already exists for this course, academic year and fee type"
            );
        }


        FeeStructure feeStructure =
                new FeeStructure();

        feeStructure.setCourse(course);

        feeStructure.setAcademicYear(
                academicYear
        );

        feeStructure.setFeeType(
                feeType
        );

        feeStructure.setAmount(
                request.getAmount()
        );

        feeStructure.setDueDate(
                request.getDueDate()
        );


        return feeStructureRepository.save(
                feeStructure
        );
    }


    // =====================================================
    // GET ALL FEE STRUCTURES
    // =====================================================

    public List<FeeStructure> getAllFeeStructures() {

        return feeStructureRepository.findAll();
    }


    // =====================================================
    // GET BY COURSE
    // =====================================================

    public List<FeeStructure>
    getFeeStructuresByCourse(
            Integer courseId
    ) {

        return feeStructureRepository
                .findByCourseCourseId(courseId);
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    public FeeStructure getFeeStructureById(
            Integer id
    ) {

        return feeStructureRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Fee structure not found with ID: "
                                        + id
                        )
                );
    }


    // =====================================================
    // UPDATE FEE STRUCTURE
    // =====================================================

    public FeeStructure updateFeeStructure(
            Integer id,
            FeeStructureRequest request
    ) {

        FeeStructure existing =
                feeStructureRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Fee structure not found with ID: "
                                                + id
                                )
                        );


        if (request.getCourseId() == null) {
            throw new RuntimeException(
                    "Course is required"
            );
        }

        if (request.getAcademicYearId() == null) {
            throw new RuntimeException(
                    "Academic year is required"
            );
        }

        if (request.getFeeTypeId() == null) {
            throw new RuntimeException(
                    "Fee type is required"
            );
        }

        if (request.getAmount() == null ||
                request.getAmount().signum() <= 0) {

            throw new RuntimeException(
                    "Amount must be greater than zero"
            );
        }


        Course course =
                courseRepository.findById(
                        request.getCourseId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Course not found"
                        )
                );


        AcademicYear academicYear =
                academicYearRepository.findById(
                        request.getAcademicYearId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Academic year not found"
                        )
                );


        FeeType feeType =
                feeTypeRepository.findById(
                        request.getFeeTypeId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Fee type not found"
                        )
                );


        // Check duplicate combination
        var duplicate =
                feeStructureRepository
                        .findByCourseCourseIdAndAcademicYearAcademicYearIdAndFeeTypeFeeTypeId(
                                course.getCourseId(),
                                academicYear.getAcademicYearId(),
                                feeType.getFeeTypeId()
                        );


        if (
                duplicate.isPresent() &&
                !duplicate.get()
                        .getFeeStructureId()
                        .equals(id)
        ) {

            throw new RuntimeException(
                    "Another fee structure already exists for this combination"
            );
        }


        existing.setCourse(course);

        existing.setAcademicYear(
                academicYear
        );

        existing.setFeeType(
                feeType
        );

        existing.setAmount(
                request.getAmount()
        );

        existing.setDueDate(
                request.getDueDate()
        );


        return feeStructureRepository.save(
                existing
        );
    }


    // =====================================================
    // DELETE FEE STRUCTURE
    // =====================================================

    public void deleteFeeStructure(
            Integer id
    ) {

        FeeStructure existing =
                feeStructureRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Fee structure not found with ID: "
                                                + id
                                )
                        );


        feeStructureRepository.delete(
                existing
        );
    }
}