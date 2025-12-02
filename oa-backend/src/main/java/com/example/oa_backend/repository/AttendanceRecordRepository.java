package com.example.oa_backend.repository;

import com.example.oa_backend.entity.AttendanceRecord;
import com.example.oa_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {

    /**
     * 查某个用户在某一天的考勤记录（用于签到/签退）
     */
    Optional<AttendanceRecord> findByUserAndDate(User user, LocalDate date);

    /**
     * 查某个用户在日期区间内的考勤记录，按日期倒序
     */
    List<AttendanceRecord> findByUserAndDateBetweenOrderByDateDesc(
            User user,
            LocalDate from,
            LocalDate to
    );
}
