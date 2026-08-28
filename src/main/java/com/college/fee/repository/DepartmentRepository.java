package com.college.fee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.college.fee.model.Department;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {

}