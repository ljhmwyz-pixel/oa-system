package com.example.oa_backend.controller;

import com.example.oa_backend.entity.LeaveRequest;
import com.example.oa_backend.entity.User;
import com.example.oa_backend.repository.LeaveRequestRepository;
import com.example.oa_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employee/leave")
public class EmployeeLeaveController {

    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;

    public EmployeeLeaveController(LeaveRequestRepository leaveRequestRepository,
                                   UserRepository userRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.userRepository = userRepository;
    }

    /**
     * 提交请假单：POST /api/employee/leave
     */
    @PostMapping
    public ResponseEntity<?> submitLeave(@RequestBody SubmitLeaveRequest req,
                                         Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String username = authentication.getName();
        User employee = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + username));

        LeaveRequest entity = new LeaveRequest();
        entity.setEmployee(employee);

        // 上级审批人：从 employee.getManager() 取，如果没有就先置空（后面再优化）
        if (employee.getManager() != null) {
            entity.setApprover(employee.getManager());
        }

        entity.setType(req.getType());
        entity.setStartDate(req.getStartDate());
        entity.setEndDate(req.getEndDate());
        entity.setReason(req.getReason());
        // 注意：你的 LeaveRequest.status 是 String，所以直接用字符串
        entity.setStatus("PENDING");

        leaveRequestRepository.save(entity);
        return ResponseEntity.ok().build();
    }

    /**
     * 当前员工自己的请假记录：
     * GET /api/employee/leave/my
     */
    @GetMapping("/my")
    public List<LeaveDTO> myLeaves(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return Collections.emptyList();
        }
        String username = authentication.getName();

        // 使用你已有的仓库方法：findByEmployeeUsernameOrderByStartDateDesc
        List<LeaveRequest> list =
                leaveRequestRepository.findByEmployeeUsernameOrderByStartDateDesc(username);

        return list.stream()
                .map(LeaveDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 当前员工作为审批人需要处理的请假单：
     * GET /api/employee/leave/to-approve
     */
    @GetMapping("/to-approve")
    public List<LeaveDTO> toApprove(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return Collections.emptyList();
        }
        String username = authentication.getName();

        // 仓库目前只有 findByStatus(String)，先查出所有 PENDING，然后在内存中过滤审批人
        List<LeaveRequest> pendingList = leaveRequestRepository.findByStatus("PENDING");

        return pendingList.stream()
                .filter(e -> e.getApprover() != null
                        && username.equals(e.getApprover().getUsername()))
                .map(LeaveDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ================= DTO =================

    public static class SubmitLeaveRequest {
        private String type;      // SICK / ANNUAL 等
        private LocalDate startDate;
        private LocalDate endDate;
        private String reason;

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }

    public static class LeaveDTO {
        private Long id;
        private String employeeUsername;
        private String employeeRealName;
        private String approverUsername;
        private String approverRealName;
        private String type;
        private LocalDate startDate;
        private LocalDate endDate;
        private String status;
        private String reason;

        public static LeaveDTO fromEntity(LeaveRequest e) {
            LeaveDTO dto = new LeaveDTO();
            dto.id = e.getId();
            if (e.getEmployee() != null) {
                dto.employeeUsername = e.getEmployee().getUsername();
                dto.employeeRealName = e.getEmployee().getRealName();
            }
            if (e.getApprover() != null) {
                dto.approverUsername = e.getApprover().getUsername();
                dto.approverRealName = e.getApprover().getRealName();
            }
            dto.type = e.getType();
            dto.startDate = e.getStartDate();
            dto.endDate = e.getEndDate();
            // 修复：status 是 String 类型，不能调用 .name() 方法
            dto.status = e.getStatus();
            dto.reason = e.getReason();
            return dto;
        }

        // getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getEmployeeUsername() { return employeeUsername; }
        public void setEmployeeUsername(String employeeUsername) { this.employeeUsername = employeeUsername; }
        
        public String getEmployeeRealName() { return employeeRealName; }
        public void setEmployeeRealName(String employeeRealName) { this.employeeRealName = employeeRealName; }
        
        public String getApproverUsername() { return approverUsername; }
        public void setApproverUsername(String approverUsername) { this.approverUsername = approverUsername; }
        
        public String getApproverRealName() { return approverRealName; }
        public void setApproverRealName(String approverRealName) { this.approverRealName = approverRealName; }
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}