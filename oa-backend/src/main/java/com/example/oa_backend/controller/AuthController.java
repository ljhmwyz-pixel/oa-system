package com.example.oa_backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;

    /**
     * 登录接口：
     * 1）校验用户名密码
     * 2）把认证信息放入 SecurityContext
     * 3）绑定到 HttpSession，生成 JSESSIONID
     */
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request,
                               HttpServletRequest httpRequest) {

        // 1. 用用户名和密码创建认证 token
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                );

        // 2. 交给 AuthenticationManager 做认证（调用 CustomUserDetailsService）
        Authentication authentication = authenticationManager.authenticate(authToken);

        // 3. 把认证信息放到 SecurityContext
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        // 4. 绑定到 HttpSession 中，让 Spring Security 通过 JSESSIONID 识别后续请求
        HttpSession session = httpRequest.getSession(true); // 没有则创建
        session.setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                context
        );

        // 5. 构造返回给前端的用户信息
        Set<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        LoginResponse resp = new LoginResponse();
        resp.setUsername(request.getUsername());
        resp.setRoles(roles);
        return resp;
    }

    /**
     * 退出登录：
     * 1）失效当前 Session
     * 2）清空 SecurityContext
     */
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest request,
                    HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();

        // ★ 可选：让浏览器删除 JSESSIONID Cookie
        jakarta.servlet.http.Cookie cookie =
                new jakarta.servlet.http.Cookie("JSESSIONID", null);
        cookie.setPath("/");      // 路径要和原来的一致
        cookie.setMaxAge(0);      // 立即失效
        cookie.setHttpOnly(true); // 和原来的属性保持一致
        response.addCookie(cookie);
    }

    /**
     * 获取当前登录用户信息（用于前端刷新恢复登录态）
     * 如果未登录，返回 401
     */
    @GetMapping("/me")
    public ResponseEntity<?> currentUser(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            // 当前没有登录用户
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 这里的 principal 就是 Spring Security 里的 UserDetails（你在 CustomUserDetailsService 返回的）
        org.springframework.security.core.userdetails.User principal =
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

        Set<String> roles = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        Map<String, Object> body = new HashMap<>();
        body.put("username", principal.getUsername());
        body.put("roles", roles);

        return ResponseEntity.ok(body);
    }

    // ================== DTO 定义 ==================

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class LoginResponse {
        private String username;
        private Set<String> roles;
    }
}
