package com.example.oa_backend.controller;

import com.example.oa_backend.dto.ManagerOptionDto;
import com.example.oa_backend.entity.Role;
import com.example.oa_backend.entity.User;
import com.example.oa_backend.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/meta")
public class AdminMetaController {

    private final UserRepository userRepository;

    public AdminMetaController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 返回可以被选为“上级/审批人”的用户列表。
     * 现在为了简单：所有用户都可以作为上级。
     * 后面你可以改成只允许 ROLE_ADMIN / ROLE_MANAGER 等角色。
     */
    @GetMapping("/managers")
    public List<ManagerOptionDto> managerOptions() {
        return userRepository.findAll()
                .stream()
                .map(u -> new ManagerOptionDto(
                        u.getId(),
                        u.getUsername(),
                        u.getRealName()
                ))
                .collect(Collectors.toList());
    }
}
