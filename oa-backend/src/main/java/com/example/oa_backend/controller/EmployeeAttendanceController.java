package com.example.oa_backend.controller;

import com.example.oa_backend.entity.AttendanceRecord;
import com.example.oa_backend.entity.User;
import com.example.oa_backend.repository.AttendanceRecordRepository;
import com.example.oa_backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee/attendance")
@RequiredArgsConstructor
public class EmployeeAttendanceController {

    private final AttendanceRecordRepository attendanceRecordRepository;
    private final UserRepository userRepository;

    /**
     * 从认证信息中拿当前 User 实体
     */
    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "未登录");
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "用户不存在"));
    }

    /**
     * 签到：同一天只允许签到一次
     */
    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn(Authentication authentication) {
        User user = getCurrentUser(authentication);
        LocalDate today = LocalDate.now();

        AttendanceRecord record = attendanceRecordRepository
                .findByUserAndDate(user, today)
                .orElse(null);

        if (record != null && record.getCheckInTime() != null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "今天已经签到过了"));
        }

        if (record == null) {
            record = new AttendanceRecord();
            record.setUser(user);
            record.setDate(today);
        }

        LocalTime now = LocalTime.now();
        record.setCheckInTime(now);

        // 简单规则：9:00 之后签到算 LATE，否则 NORMAL
        LocalTime start = LocalTime.of(9, 0);
        if (now.isAfter(start)) {
            record.setStatus("LATE");
        } else {
            record.setStatus("NORMAL");
        }

        attendanceRecordRepository.save(record);

        return ResponseEntity.ok(Map.of("message", "签到成功", "recordId", record.getId()));
    }

    /**
     * 签退：同一天已有记录，则填充签退时间
     */
    @PostMapping("/check-out")
    public ResponseEntity<?> checkOut(Authentication authentication) {
        User user = getCurrentUser(authentication);
        LocalDate today = LocalDate.now();

        AttendanceRecord record = attendanceRecordRepository
                .findByUserAndDate(user, today)
                .orElse(null);

        if (record == null || record.getCheckInTime() == null) {
            // 没有签到记录就想签退，标记为 ABNORMAL
            record = new AttendanceRecord();
            record.setUser(user);
            record.setDate(today);
            record.setStatus("ABNORMAL");
            record.setCheckInTime(null);
        }

        if (record.getCheckOutTime() != null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "今天已经签退过了"));
        }

        record.setCheckOutTime(LocalTime.now());

        attendanceRecordRepository.save(record);

        return ResponseEntity.ok(Map.of("message", "签退成功", "recordId", record.getId()));
    }

    /**
     * 查询自己的考勤记录，日期范围可选，默认最近 30 天
     */
    @GetMapping("/my")
    public List<AttendanceDto> myAttendance(
            Authentication authentication,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate to
    ) {
        User user = getCurrentUser(authentication);
        LocalDate today = LocalDate.now();
        if (from == null) {
            from = today.minusDays(30);
        }
        if (to == null) {
            to = today;
        }

        List<AttendanceRecord> records = attendanceRecordRepository
                .findByUserAndDateBetweenOrderByDateDesc(user, from, to);

        return records.stream()
                .map(AttendanceDto::fromEntity)
                .toList();
    }

    // ====== 简单 DTO，避免把 User 之类全部抛给前端 ======

    @Data
    @AllArgsConstructor
    public static class AttendanceDto {
        private Long id;
        private LocalDate date;
        private LocalTime checkInTime;
        private LocalTime checkOutTime;
        private String status;

        public static AttendanceDto fromEntity(AttendanceRecord r) {
            return new AttendanceDto(
                    r.getId(),
                    r.getDate(),
                    r.getCheckInTime(),
                    r.getCheckOutTime(),
                    r.getStatus()
            );
        }
    }
}
