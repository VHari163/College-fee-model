package com.college.fee.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.college.fee.model.FeeStructure;

public interface FeeStructureRepository extends JpaRepository<FeeStructure, Integer> {

    Optional<FeeStructure>
    findByCourseCourseIdAndAcademicYearAcademicYearIdAndFeeTypeFeeTypeId(
            Integer courseId,
            Integer academicYearId,
            Integer feeTypeId
    );

    List<FeeStructure> findByCourseCourseId(Integer courseId);
}