// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);           // { username, roles: Set }
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true); // 启动时正在检查后端 session

  // 启动时向后端问“我是谁”，用来恢复登录态
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get('/api/auth/me'); // 会自动带上 JSESSIONID
        const data = res.data || {};
        const roles = new Set(data.roles || []);

        setUser({
          username: data.username,
          roles,
        });
        setIsAuthenticated(true);
      } catch (err) {
        // 未登录或 session 失效
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setInitializing(false);
      }
    };

    checkSession();
  }, []);

  // ★ 提供一个统一的 logout 函数
  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      console.error('调用后端注销失败，可忽略：', e);
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    initializing,
    logout,          // ★ 这里把 logout 放出去
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>');
  }
  return ctx;
};
