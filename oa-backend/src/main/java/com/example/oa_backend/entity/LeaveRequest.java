package com.example.oa_backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "leave_request")
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 请假人（员工）
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private User employee;

    /**
     * 审批人（可以为空；以后做“上级审批”时会用到）
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id")
    private User approver;

    /**
     * 请假开始日期
     */
    @Column(nullable = false)
    private LocalDate startDate;

    /**
     * 请假结束日期
     */
    @Column(nullable = false)
    private LocalDate endDate;

    /**
     * 请假类型，例如：事假 / 病假 / 年假
     */
    @Column(length = 50)
    private String type;

    /**
     * 请假原因
     */
    @Column(length = 500)
    private String reason;

    /**
     * 状态：PENDING / APPROVED / REJECTED
     */
    @Column(length = 20, nullable = false)
    private String status;

    // ======== getter / setter ========

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getEmployee() {
        return employee;
    }

    public void setEmployee(User employee) {
        this.employee = employee;
    }

    public User getApprover() {
        return approver;
    }

    public void setApprover(User approver) {
        this.approver = approver;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
