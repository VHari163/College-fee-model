package com.college.fee.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "fee_types")
public class FeeType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fee_type_id")
    private Integer feeTypeId;

    @Column(name = "fee_name", nullable = false, unique = true)
    private String feeName;

    @Column(name = "description")
    private String description;

    public FeeType() {
    }

    public Integer getFeeTypeId() {
        return feeTypeId;
    }

    public String getFeeName() {
        return feeName;
    }

    public void setFeeName(String feeName) {
        this.feeName = feeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}