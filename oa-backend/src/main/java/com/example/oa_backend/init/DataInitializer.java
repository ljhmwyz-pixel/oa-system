package com.example.oa_backend.init;

import com.example.oa_backend.entity.Role;
import com.example.oa_backend.entity.User;
import com.example.oa_backend.repository.RoleRepository;
import com.example.oa_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData(RoleRepository roleRepository,
                                      UserRepository userRepository) {
        return args -> {

            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> {
                        Role r = new Role();
                        r.setName("ROLE_ADMIN");
                        return roleRepository.save(r);
                    });

            Role empRole = roleRepository.findByName("ROLE_EMP")
                    .orElseGet(() -> {
                        Role r = new Role();
                        r.setName("ROLE_EMP");
                        return roleRepository.save(r);
                    });

            if (userRepository.findByUsername("admin").isEmpty()) {
                User u = new User();
                u.setUsername("admin");
                u.setRealName("管理员");
                u.setPassword(passwordEncoder.encode("123456"));
                u.setEnabled(true);
                u.setRoles(Set.of(adminRole));
                userRepository.save(u);
            }

            if (userRepository.findByUsername("emp").isEmpty()) {
                User u = new User();
                u.setUsername("emp");
                u.setRealName("员工A");
                u.setPassword(passwordEncoder.encode("123456"));
                u.setEnabled(true);
                u.setRoles(Set.of(empRole));
                userRepository.save(u);
            }
        };
    }
}
