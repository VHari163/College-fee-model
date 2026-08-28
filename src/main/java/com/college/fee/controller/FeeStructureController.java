package com.college.fee.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
            FeeStructureService feeStructureService) {
        this.feeStructureService = feeStructureService;
    }

    @PostMapping
    public ResponseEntity<FeeStructure> addFeeStructure(
            @RequestBody FeeStructureRequest request) {

        return ResponseEntity.ok(
                feeStructureService.addFeeStructure(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<FeeStructure>> getAllFeeStructures() {

        return ResponseEntity.ok(
                feeStructureService.getAllFeeStructures()
        );
    }
}