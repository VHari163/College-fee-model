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

    // ==========================================
    // GET ALL FEE TYPES
    // ==========================================

    @GetMapping
    public ResponseEntity<List<FeeType>> getAllFeeTypes() {

        return ResponseEntity.ok(
                feeTypeService.getAllFeeTypes()
        );
    }


    // ==========================================
    // GET FEE TYPE BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<FeeType> getFeeTypeById(
            @PathVariable Integer id
    ) {

        return ResponseEntity.ok(
                feeTypeService.getFeeTypeById(id)
        );
    }


    // ==========================================
    // ADD FEE TYPE
    // ==========================================

    @PostMapping
    public ResponseEntity<FeeType> addFeeType(
            @RequestBody FeeType feeType
    ) {

        return ResponseEntity.ok(
                feeTypeService.addFeeType(feeType)
        );
    }


    // ==========================================
    // UPDATE FEE TYPE
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<FeeType> updateFeeType(
            @PathVariable Integer id,
            @RequestBody FeeType feeType
    ) {

        return ResponseEntity.ok(
                feeTypeService.updateFeeType(
                        id,
                        feeType
                )
        );
    }


    // ==========================================
    // DELETE FEE TYPE
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFeeType(
            @PathVariable Integer id
    ) {

        feeTypeService.deleteFeeType(id);

        return ResponseEntity.ok(
                "Fee type deleted successfully"
        );
    }
}