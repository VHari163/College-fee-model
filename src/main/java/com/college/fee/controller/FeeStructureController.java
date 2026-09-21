package com.college.fee.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.college.fee.dto.FeeStructureRequest;
import com.college.fee.model.FeeStructure;
import com.college.fee.service.FeeStructureService;

@RestController
@RequestMapping("/api/fee-structures")
@CrossOrigin
public class FeeStructureController {

    private final FeeStructureService feeStructureService;

    public FeeStructureController(
            FeeStructureService feeStructureService
    ) {
        this.feeStructureService =
                feeStructureService;
    }


    // =====================================================
    // GET ALL
    // =====================================================

    @GetMapping
    public ResponseEntity<List<FeeStructure>>
    getAllFeeStructures() {

        return ResponseEntity.ok(
                feeStructureService
                        .getAllFeeStructures()
        );
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<FeeStructure>
    getFeeStructureById(
            @PathVariable Integer id
    ) {

        return ResponseEntity.ok(
                feeStructureService
                        .getFeeStructureById(id)
        );
    }


    // =====================================================
    // GET BY COURSE
    // =====================================================

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<FeeStructure>>
    getFeeStructuresByCourse(
            @PathVariable Integer courseId
    ) {

        return ResponseEntity.ok(
                feeStructureService
                        .getFeeStructuresByCourse(
                                courseId
                        )
        );
    }


    // =====================================================
    // ADD
    // =====================================================

    @PostMapping
    public ResponseEntity<FeeStructure>
    addFeeStructure(
            @RequestBody FeeStructureRequest request
    ) {

        return ResponseEntity.ok(
                feeStructureService
                        .addFeeStructure(request)
        );
    }


    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<FeeStructure>
    updateFeeStructure(
            @PathVariable Integer id,
            @RequestBody FeeStructureRequest request
    ) {

        return ResponseEntity.ok(
                feeStructureService
                        .updateFeeStructure(
                                id,
                                request
                        )
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteFeeStructure(
            @PathVariable Integer id
    ) {

        feeStructureService
                .deleteFeeStructure(id);

        return ResponseEntity.ok(
                "Fee structure deleted successfully"
        );
    }
}