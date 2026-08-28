package com.college.fee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.college.fee.model.FeePayment;

public interface FeePaymentRepository
        extends JpaRepository<FeePayment, Integer> {

}