// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminHome from './pages/AdminHome';
import EmployeeHome from './pages/EmployeeHome';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, initializing } = useAuth();

  // AuthContext 还在从后端恢复状态，先不要做任何跳转
  if (initializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !user?.roles?.has(requiredRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const { initializing } = useAuth();

  // 整个应用刚启动时，统一显示一个加载中
  if (initializing) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        正在恢复登录状态...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <PrivateRoute requiredRole="ROLE_ADMIN">
            <AdminHome />
          </PrivateRoute>
        }
      />

      <Route
        path="/employee"
        element={
          <PrivateRoute requiredRole="ROLE_EMP">
            <EmployeeHome />
          </PrivateRoute>
        }
      />

      {/* 默认重定向 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
