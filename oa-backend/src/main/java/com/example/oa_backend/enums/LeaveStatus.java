package com.example.oa_backend.enums;

public enum LeaveStatus {
    // 待审批
    PENDING,
    // 审批通过
    APPROVED,
    // 审批拒绝
    REJECTED,
    // 打回重填 / 退回修改（如果暂时不用，也可以先不用）
    RETURNED
}
