package com.example.oa_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "attendance_record")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 关联员工
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // 返回给前端时不展开整个 User，避免循环引用
    private User user;

    /**
     * 考勤日期（只存日期）
     */
    @Column(nullable = false)
    private LocalDate date;

    /**
     * 签到时间
     */
    private LocalTime checkInTime;

    /**
     * 签退时间
     */
    private LocalTime checkOutTime;

    /**
     * 状态：NORMAL / LATE / ABSENT / ABNORMAL 等
     */
    @Column(length = 20)
    private String status;

    /**
     * 备注（可选）
     */
    @Column(length = 255)
    private String remark;
}
