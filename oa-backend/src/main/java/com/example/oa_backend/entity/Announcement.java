package com.example.oa_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "oa_announcement")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    // 发布人 ID（可以为空）
    private Long creatorId;

    @Column(nullable = false)
    private LocalDateTime createTime = LocalDateTime.now();
}
