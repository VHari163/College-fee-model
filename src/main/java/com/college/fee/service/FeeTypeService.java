package com.college.fee.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.college.fee.model.FeeType;
import com.college.fee.repository.FeeTypeRepository;

@Service
public class FeeTypeService {

    private final FeeTypeRepository feeTypeRepository;

    public FeeTypeService(FeeTypeRepository feeTypeRepository) {
        this.feeTypeRepository = feeTypeRepository;
    }

    // Get all fee types
    public List<FeeType> getAllFeeTypes() {
        return feeTypeRepository.findAll();
    }

    // Get one fee type
    public FeeType getFeeTypeById(Integer id) {

        return feeTypeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Fee type not found with ID: " + id
                        )
                );
    }

    // Add fee type
    public FeeType addFeeType(FeeType feeType) {

        if (feeType.getFeeName() == null ||
                feeType.getFeeName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Fee name cannot be empty"
            );
        }

        feeType.setFeeName(
                feeType.getFeeName().trim()
        );

        return feeTypeRepository.save(feeType);
    }

    // Update fee type
    public FeeType updateFeeType(
            Integer id,
            FeeType updatedFeeType
    ) {

        FeeType existingFeeType =
                feeTypeRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Fee type not found with ID: " + id
                                )
                        );

        if (updatedFeeType.getFeeName() == null ||
                updatedFeeType.getFeeName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Fee name cannot be empty"
            );
        }

        existingFeeType.setFeeName(
                updatedFeeType.getFeeName().trim()
        );

        existingFeeType.setDescription(
                updatedFeeType.getDescription()
        );

        return feeTypeRepository.save(
                existingFeeType
        );
    }

    // Delete fee type
    public void deleteFeeType(Integer id) {

        if (!feeTypeRepository.existsById(id)) {

            throw new RuntimeException(
                    "Fee type not found with ID: " + id
            );
        }

        feeTypeRepository.deleteById(id);
    }
}