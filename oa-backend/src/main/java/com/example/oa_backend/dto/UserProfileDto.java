package com.example.oa_backend.dto;

import com.example.oa_backend.entity.User;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UserProfileDto {

    private Long id;
    private String username;
    private String realName;
    private String gender;
    private String phone;
    private String email;
    private String department;
    private String position;
    private LocalDate hireDate;
    private String level;
    private BigDecimal baseSalary;
    private String status;
    private String address;

    public static UserProfileDto from(User u) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(u.getId());
        dto.setUsername(u.getUsername());
        dto.setRealName(u.getRealName());
        dto.setGender(u.getGender());
        dto.setPhone(u.getPhone());
        dto.setEmail(u.getEmail());
        dto.setDepartment(u.getDepartment());
        dto.setPosition(u.getPosition());
        dto.setHireDate(u.getHireDate());
        dto.setLevel(u.getLevel());
        dto.setBaseSalary(u.getBaseSalary());
        dto.setStatus(u.getStatus());
        dto.setAddress(u.getAddress());
        return dto;
    }
}
