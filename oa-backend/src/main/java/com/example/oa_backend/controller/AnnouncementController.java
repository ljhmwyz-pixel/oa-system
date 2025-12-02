package com.example.oa_backend.controller;

import com.example.oa_backend.entity.Announcement;
import com.example.oa_backend.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;

    // 员工查看公告
    @GetMapping("/api/employee/announcement")
    public List<Announcement> listForEmployee() {
        return announcementRepository.findAll();
    }

    // 管理员发布公告
    @PostMapping("/api/admin/announcement")
    public Announcement create(@RequestBody Announcement announcement) {
        return announcementRepository.save(announcement);
    }
}
