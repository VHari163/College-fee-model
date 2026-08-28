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

    public FeeType addFeeType(FeeType feeType) {
        return feeTypeRepository.save(feeType);
    }

    public List<FeeType> getAllFeeTypes() {
        return feeTypeRepository.findAll();
    }
}