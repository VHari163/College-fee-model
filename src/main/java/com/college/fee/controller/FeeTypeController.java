package com.college.fee.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.college.fee.model.FeeType;
import com.college.fee.service.FeeTypeService;

@RestController
@RequestMapping("/api/fee-types")
@CrossOrigin
public class FeeTypeController {

    private final FeeTypeService feeTypeService;

    public FeeTypeController(FeeTypeService feeTypeService) {
        this.feeTypeService = feeTypeService;
    }

    @PostMapping
    public ResponseEntity<FeeType> addFeeType(
            @RequestBody FeeType feeType) {

        return ResponseEntity.ok(
                feeTypeService.addFeeType(feeType)
        );
    }

    @GetMapping
    public ResponseEntity<List<FeeType>> getAllFeeTypes() {

        return ResponseEntity.ok(
                feeTypeService.getAllFeeTypes()
        );
    }
}