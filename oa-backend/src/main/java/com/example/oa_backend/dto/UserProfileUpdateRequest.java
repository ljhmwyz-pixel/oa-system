package com.example.oa_backend.dto;

import lombok.Data;

@Data
public class UserProfileUpdateRequest {

    // 个人可编辑的部分，其他字段由管理员维护
    private String phone;
    private String email;
    private String address;
}
