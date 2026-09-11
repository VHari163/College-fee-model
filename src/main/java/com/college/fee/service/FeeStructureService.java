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
            FeeTypeRepository feeTypeRepository) {

        this.feeStructureRepository = feeStructureRepository;
        this.courseRepository = courseRepository;
        this.academicYearRepository = academicYearRepository;
        this.feeTypeRepository = feeTypeRepository;
    }

    public FeeStructure addFeeStructure(FeeStructureRequest request) {

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        AcademicYear academicYear = academicYearRepository.findById(
                request.getAcademicYearId())
                .orElseThrow(() ->
                        new RuntimeException("Academic year not found"));

        FeeType feeType = feeTypeRepository.findById(
                request.getFeeTypeId())
                .orElseThrow(() ->
                        new RuntimeException("Fee type not found"));

        FeeStructure feeStructure = new FeeStructure();

        feeStructure.setCourse(course);
        feeStructure.setAcademicYear(academicYear);
        feeStructure.setFeeType(feeType);
        feeStructure.setAmount(request.getAmount());
        feeStructure.setDueDate(request.getDueDate());

        return feeStructureRepository.save(feeStructure);
    }

    public List<FeeStructure> getAllFeeStructures() {
        return feeStructureRepository.findAll();
    }

    public FeeStructure getFeeStructureById(Integer id) {
        return feeStructureRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Fee structure not found"));
    }

    public List<FeeStructure> getFeeStructuresByCourse(Integer courseId) {

        return feeStructureRepository.findByCourseCourseId(courseId);
    }
}