package com.college.fee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.college.fee.model.FeeType;

public interface FeeTypeRepository extends JpaRepository<FeeType, Integer> {

}