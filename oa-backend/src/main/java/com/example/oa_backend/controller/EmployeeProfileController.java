package com.example.oa_backend.controller;

import java.time.LocalDate;
import java.math.BigDecimal;
import com.example.oa_backend.entity.User;
import com.example.oa_backend.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/employee/profile")
@RequiredArgsConstructor
public class EmployeeProfileController {

    private final UserRepository userRepository;

    /**
     * 获取个人信息：
     * GET /api/employee/profile/{username}
     */
    @GetMapping("/{username}")
    public UserProfileResponse getProfile(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "用户不存在"));

        return toDto(user);
    }

    /**
     * 修改联系方式：
     * PUT /api/employee/profile/{username}
     */
    @PutMapping("/{username}")
    public UserProfileResponse updateProfile(@PathVariable String username,
                                            @RequestBody UpdateProfileRequest req) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "用户不存在"));

        // 这里只允许改联系方式三项
        user.setPhone(req.getPhone());
        user.setEmail(req.getEmail());
        user.setAddress(req.getAddress());

        User saved = userRepository.save(user);
        return toDto(saved);
    }

    private UserProfileResponse toDto(User u) {
        UserProfileResponse dto = new UserProfileResponse();
        dto.setUsername(u.getUsername());
        dto.setRealName(u.getRealName());
        dto.setDepartment(u.getDepartment());
        dto.setPosition(u.getPosition());
        dto.setHireDate(u.getHireDate());   // 如果实体是 LocalDate，类型保持一致
        dto.setLevel(u.getLevel());
        dto.setBaseSalary(u.getBaseSalary());
        dto.setStatus(u.getStatus());
        dto.setPhone(u.getPhone());
        dto.setEmail(u.getEmail());
        dto.setAddress(u.getAddress());
        dto.setBaseSalary(u.getBaseSalary());
        return dto;
    }

    @Data
    public static class UserProfileResponse {
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
        private String address;
    }


    @Data
    public static class UpdateProfileRequest {
        private String phone;
        private String email;
        private String address;
    }
}
