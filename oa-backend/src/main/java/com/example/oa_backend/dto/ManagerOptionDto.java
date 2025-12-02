package com.example.oa_backend.dto;

public class ManagerOptionDto {

    private Long id;
    private String username;
    private String realName;

    public ManagerOptionDto() {
    }

    public ManagerOptionDto(Long id, String username, String realName) {
        this.id = id;
        this.username = username;
        this.realName = realName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }
}
