package com.example.oa_backend.config;

import com.example.oa_backend.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    /**
     * Spring Security 主配置
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 前后端分离，先关闭 CSRF
                .csrf(AbstractHttpConfigurer::disable)
                // CORS 配置
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 使用 Session 保存登录状态
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .authorizeHttpRequests(auth -> auth
                        // 登录接口放行
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()

                        // 个人资料接口：只要登录用户即可访问（先放宽，避免 403）
                        .requestMatchers("/api/employee/profile/**").authenticated()

                        // 管理员接口
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 员工业务接口（请假、公告等），管理员或员工都可以访问
                        .requestMatchers("/api/employee/**").hasAnyRole("ADMIN", "EMP")

                        // 其他所有请求都要求已登录
                        .anyRequest().authenticated()
                )
                // 禁用默认表单登录和 basic 认证，由我们自己实现 /api/auth/login
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                // 使用自定义的 DaoAuthenticationProvider
                .authenticationProvider(daoAuthenticationProvider());

        return http.build();
    }

    /**
     * 使用自定义 UserDetailsService + BCrypt 密码加密
     * 注：你当前 Spring Security 版本的 DaoAuthenticationProvider 需要在构造函数中传入 UserDetailsService
     */
    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        // 关键修改：使用带 UserDetailsService 的构造函数
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * 密码加密器
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * AuthenticationManager 注入（给 AuthController 用）
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /**
     * CORS 配置：允许前端 http://localhost:5173 访问，并携带 cookie
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // 你前端运行的地址
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        // 允许带上 cookie（JSESSIONID）
        config.setAllowCredentials(true);
        // 允许的方法
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // 允许的请求头
        config.setAllowedHeaders(List.of("*"));
        // 暴露的响应头（按需要添加）
        config.setExposedHeaders(List.of("Set-Cookie"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
