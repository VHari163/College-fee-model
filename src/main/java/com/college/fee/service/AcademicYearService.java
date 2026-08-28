package com.college.fee.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.college.fee.model.AcademicYear;
import com.college.fee.repository.AcademicYearRepository;

@Service
public class AcademicYearService {

    private final AcademicYearRepository academicYearRepository;

    public AcademicYearService(AcademicYearRepository academicYearRepository) {
        this.academicYearRepository = academicYearRepository;
    }

    public AcademicYear addAcademicYear(AcademicYear academicYear) {
        return academicYearRepository.save(academicYear);
    }

    public List<AcademicYear> getAllAcademicYears() {
        return academicYearRepository.findAll();
    }
}