package com.college.fee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.college.fee.model.Course;

public interface CourseRepository extends JpaRepository<Course, Integer> {

}