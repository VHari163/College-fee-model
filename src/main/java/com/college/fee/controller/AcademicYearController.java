package com.college.fee.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.college.fee.model.AcademicYear;
import com.college.fee.service.AcademicYearService;

@RestController
@RequestMapping("/api/academic-years")
@CrossOrigin
public class AcademicYearController {

    private final AcademicYearService academicYearService;

    public AcademicYearController(AcademicYearService academicYearService) {
        this.academicYearService = academicYearService;
    }

    @PostMapping
    public ResponseEntity<AcademicYear> addAcademicYear(
            @RequestBody AcademicYear academicYear) {

        return ResponseEntity.ok(
                academicYearService.addAcademicYear(academicYear)
        );
    }

    @GetMapping
    public ResponseEntity<List<AcademicYear>> getAllAcademicYears() {

        return ResponseEntity.ok(
                academicYearService.getAllAcademicYears()
        );
    }
}