package com.example.oa_backend.repository;

import com.example.oa_backend.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    /**
     * 员工查看自己的请假记录
     * employee.username 这里假设 LeaveRequest 里有一个 employee 字段，
     * employee 里面有 username 属性（和你现在的代码保持一致）
     */
    List<LeaveRequest> findByEmployeeUsernameOrderByStartDateDesc(String username);

    /**
     * 按状态查询（用于管理员查 PENDING 的请假单）
     */
    List<LeaveRequest> findByStatus(String status);
}
