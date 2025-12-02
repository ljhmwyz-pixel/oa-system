package com.example.oa_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "sys_role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 例如：ROLE_ADMIN / ROLE_EMP
    @Column(unique = true, nullable = false, length = 50)
    private String name;
}
