package com.example.oa_backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UserAdminUpdateRequest {

    private String realName;
    private String department;
    private String position;
    private LocalDate hireDate;
    private String level;
    private BigDecimal baseSalary;
    private String status;
    private String phone;
    private String email;
}
