package com.college.fee.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "students")
public class Student {

    // =========================================================
    // STUDENT ID
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Integer studentId;


    // =========================================================
    // BASIC DETAILS
    // =========================================================

    @Column(name = "roll_number", nullable = false, unique = true)
    private String rollNumber;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "gender")
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "address")
    private String address;


    // =========================================================
    // ACADEMIC DETAILS
    // =========================================================

    @Column(name = "department")
    private String department;

    @Column(name = "course")
    private String course;

    @Column(name = "year_of_study")
    private Integer yearOfStudy;

    @Column(name = "admission_year")
    private Integer admissionYear;


    // =========================================================
    // HOSTEL / TRANSPORT DETAILS
    // =========================================================

    @Column(name = "hostel_status")
    private String hostelStatus;

    @Column(name = "transport_status")
    private String transportStatus;


    // =========================================================
    // CREATED DATE
    // =========================================================

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public Student() {
    }


    // =========================================================
    // GETTERS AND SETTERS
    // =========================================================

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }


    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }


    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }


    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }


    public Integer getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(Integer yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }


    public Integer getAdmissionYear() {
        return admissionYear;
    }

    public void setAdmissionYear(Integer admissionYear) {
        this.admissionYear = admissionYear;
    }


    public String getHostelStatus() {
        return hostelStatus;
    }

    public void setHostelStatus(String hostelStatus) {
        this.hostelStatus = hostelStatus;
    }


    public String getTransportStatus() {
        return transportStatus;
    }

    public void setTransportStatus(String transportStatus) {
        this.transportStatus = transportStatus;
    }


    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}