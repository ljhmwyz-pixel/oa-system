package com.example.oa_backend.controller;

import com.example.oa_backend.entity.LeaveRequest;
import com.example.oa_backend.repository.LeaveRequestRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.oa_backend.dto.LeaveDto;
import java.util.List;

@RestController
@RequestMapping("/api/admin/leaves")
public class AdminLeaveController {

    private final LeaveRequestRepository leaveRepo;

    public AdminLeaveController(LeaveRequestRepository leaveRepo) {
        this.leaveRepo = leaveRepo;
    }

    // 管理员 / 上级：查看所有待审批的请假
    @GetMapping("/pending")
    public List<LeaveDto> getPending() {
        return leaveRepo.findByStatus("PENDING").stream()
                .map(LeaveDto::fromEntity)
                .toList();
    }

    // 通过
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        LeaveRequest leave = leaveRepo.findById(id).orElse(null);
        if (leave == null) {
            return ResponseEntity.notFound().build();
        }
        leave.setStatus("APPROVED");
        leaveRepo.save(leave);
        return ResponseEntity.ok().build();
    }

    // 拒绝
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        LeaveRequest leave = leaveRepo.findById(id).orElse(null);
        if (leave == null) {
            return ResponseEntity.notFound().build();
        }
        leave.setStatus("REJECTED");
        leaveRepo.save(leave);
        return ResponseEntity.ok().build();
    }
}
