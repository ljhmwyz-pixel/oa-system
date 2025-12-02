package com.example.oa_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;


@Data
@Entity
@Table(name = "sys_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 登录账号（唯一）
     */
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    /**
     * 登录密码（BCrypt 加密后的密文）
     */
    @Column(nullable = false)
    private String password;

    /**
     * 真实姓名
     */
    @Column(length = 100)
    private String realName;

    /**
     * 性别：可以存 "男"/"女" 或 "M"/"F"
     */
    @Column(length = 10)
    private String gender;

    /**
     * 手机号
     */
    @Column(length = 20)
    private String phone;

    /**
     * 邮箱
     */
    @Column(length = 100)
    private String email;

    /**
     * 部门（简单起见先用字符串，后面可以单独做 Department 表）
     */
    @Column(length = 50)
    private String department;

    /**
     * 职位 / 岗位
     */
    @Column(length = 50)
    private String position;

    /**
     * 入职日期
     */
    private LocalDate hireDate;

    /**
     * 职级，例如：P1 / P2，或 初级 / 中级 / 高级
     */
    @Column(length = 20)
    private String level;

    /**
     * 基础工资
     */
    @Column(precision = 12, scale = 2)
    private BigDecimal baseSalary;

    /**
     * 在职状态：例如 ACTIVE / LEFT 等
     */
    @Column(length = 20)
    private String status;

    /**
     * 联系地址
     */
    @Column(length = 255)
    private String address;

    /**
     * 账户是否启用
     */
    @Column(nullable = false)
    private Boolean enabled = true;

    /**
     * 角色集合（管理员 / 员工等）
     */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "sys_user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;

        /**
     * 直属上级（比如部门主管、组长）
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    @JsonIgnore
    private User manager;

    /**
     * 下属员工集合（通常不用返回给前端，仅供查询）
     */
    @OneToMany(mappedBy = "manager")
    @JsonIgnore
    private Set<User> subordinates;

}
