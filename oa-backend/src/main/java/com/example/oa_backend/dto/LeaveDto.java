// LeaveDto.java
package com.example.oa_backend.dto;

import com.example.oa_backend.entity.LeaveRequest;
import java.time.LocalDate;

public class LeaveDto {

    private Long id;
    private String employeeName;
    private String approverName;
    private String type;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;

    public static LeaveDto fromEntity(LeaveRequest e) {
        LeaveDto dto = new LeaveDto();
        dto.id = e.getId();
        dto.employeeName = (e.getEmployee() != null)
                ? e.getEmployee().getRealName() != null
                    ? e.getEmployee().getRealName()
                    : e.getEmployee().getUsername()
                : "-";
        dto.approverName = (e.getApprover() != null)
                ? e.getApprover().getRealName() != null
                    ? e.getApprover().getRealName()
                    : e.getApprover().getUsername()
                : "-";
        dto.type = e.getType();
        dto.startDate = e.getStartDate();
        dto.endDate = e.getEndDate();
        dto.status = e.getStatus();
        return dto;
    }
}
