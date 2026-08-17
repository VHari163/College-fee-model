package com.college.fee.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.college.fee.model.Student;
import com.college.fee.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Integer id) {
        return studentRepository.findById(id);
    }

    public void deleteStudent(Integer id) {
        studentRepository.deleteById(id);
    }
}