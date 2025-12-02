package com.example.oa_backend.dto;

import com.example.oa_backend.entity.User;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UserAdminDto {

    private Long id;
    private String username;
    private String realName;
    private String department;
    private String position;
    private LocalDate hireDate;
    private String level;
    private BigDecimal baseSalary;
    private String status;
    private String phone;
    private String email;

    public static UserAdminDto from(User u) {
        UserAdminDto dto = new UserAdminDto();
        dto.setId(u.getId());
        dto.setUsername(u.getUsername());
        dto.setRealName(u.getRealName());
        dto.setDepartment(u.getDepartment());
        dto.setPosition(u.getPosition());
        dto.setHireDate(u.getHireDate());
        dto.setLevel(u.getLevel());
        dto.setBaseSalary(u.getBaseSalary());
        dto.setStatus(u.getStatus());
        dto.setPhone(u.getPhone());
        dto.setEmail(u.getEmail());
        return dto;
    }
}
