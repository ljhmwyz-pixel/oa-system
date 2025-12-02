package com.example.oa_backend.controller;

import com.example.oa_backend.entity.Role;
import com.example.oa_backend.entity.User;
import com.example.oa_backend.repository.RoleRepository;
import com.example.oa_backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 员工列表
     */
    @GetMapping
    public List<UserDto> list() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 新增员工（可以指定上级 managerId）
     */
    @PostMapping
    public ResponseEntity<UserDto> create(@RequestBody CreateUserRequest req) {
        if (req.getUsername() == null || req.getUsername().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "用户名不能为空");
        }
        if (req.getPassword() == null || req.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "密码不能为空");
        }
        if (req.getRealName() == null || req.getRealName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "姓名不能为空");
        }

        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "用户名已存在");
        }

        // 默认给 EMP 角色（如有需要，可以根据 req 增加 admin）
        Role empRole = roleRepository.findByName("ROLE_EMP")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "未找到 ROLE_EMP 角色"));

        // 处理直属上级
        User manager = null;
        if (req.getManagerId() != null) {
            manager = userRepository.findById(req.getManagerId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "上级用户不存在"));
        }

        User u = new User();
        u.setUsername(req.getUsername());
        u.setRealName(req.getRealName());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setEnabled(true);
        u.setRoles(Set.of(empRole));

        u.setDepartment(req.getDepartment());
        u.setPosition(req.getPosition());
        u.setPhone(req.getPhone());
        u.setEmail(req.getEmail());
        u.setAddress(req.getAddress());
        u.setStatus(req.getStatus());
        u.setLevel(req.getLevel());

        if (req.getHireDate() != null) {
            u.setHireDate(req.getHireDate());
        }
        if (req.getBaseSalary() != null) {
            u.setBaseSalary(req.getBaseSalary());
        }

        // ★ 关键：保存直属上级
        u.setManager(manager);

        userRepository.save(u);

        return ResponseEntity.ok(UserDto.fromEntity(u));
    }

    /**
     * 删除员工
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "用户不存在");
        }
        userRepository.deleteById(id);
    }

    /**
     * 获取可选“上级”列表
     * 这里简单地返回所有启用用户，你可以后面改成只返回某些职级 / 角色
     */
    @GetMapping("/managers")
    public List<ManagerOption> managers() {
        return userRepository.findAll().stream()
                .filter(User::getEnabled)
                .map(u -> new ManagerOption(u.getId(), u.getRealName(), u.getUsername()))
                .collect(Collectors.toList());
    }

    // ================== DTO 定义 ==================

    @Data
    public static class CreateUserRequest {
        private String username;
        private String password;
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

        private Long managerId; // ★ 新增：上级用户 ID
    }

    @Data
    @AllArgsConstructor
    public static class ManagerOption {
        private Long id;
        private String realName;
        private String username;
    }

    @Data
    @AllArgsConstructor
    public static class UserDto {
        private Long id;
        private String username;
        private String realName;
        private String department;
        private String position;
        private String hireDate;
        private String level;
        private BigDecimal baseSalary;
        private String status;
        private String phone;
        private String email;
        private String managerName;      // ★ 上级姓名
        private String managerUsername;  // ★ 上级账号

        public static UserDto fromEntity(User u) {
            String managerName = null;
            String managerUsername = null;
            if (u.getManager() != null) {
                managerName = u.getManager().getRealName();
                managerUsername = u.getManager().getUsername();
            }

            return new UserDto(
                    u.getId(),
                    u.getUsername(),
                    u.getRealName(),
                    u.getDepartment(),
                    u.getPosition(),
                    u.getHireDate() != null ? u.getHireDate().toString() : null,
                    u.getLevel(),
                    u.getBaseSalary(),
                    u.getStatus(),
                    u.getPhone(),
                    u.getEmail(),
                    managerName,
                    managerUsername
            );
        }
    }
}
