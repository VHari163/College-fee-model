package com.college.fee.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.college.fee.model.Course;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    Optional<Course> findByCourseName(String courseName);
}