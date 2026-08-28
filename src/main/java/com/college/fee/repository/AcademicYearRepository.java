package com.college.fee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.college.fee.model.AcademicYear;

public interface AcademicYearRepository
        extends JpaRepository<AcademicYear, Integer> {

}