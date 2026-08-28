package com.college.fee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.college.fee.model.FeeStructure;

public interface FeeStructureRepository
        extends JpaRepository<FeeStructure, Integer> {

}
