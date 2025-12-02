import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let res;
    try {
      // 只把「请求本身」放在 try 里
      res = await api.post('/api/auth/login', {
        username,
        password,
      });
    } catch (err) {
      console.error('登录请求失败', err);

      // 后端没启动 / 网络错误
      if (err.code === 'ERR_NETWORK') {
        alert('无法连接后端服务，请确认后端已在 http://localhost:8080 运行。');
        return;
      }

      // 用户名或密码错误
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError('用户名或密码错误 / Invalid username or password.');
        return;
      }

      // 其他异常
      setError('登录失败，请稍后重试 / Login failed, please try again later.');
      return;
    }

    // 走到这里，说明 HTTP 已经是 2xx，不再当成“登录失败”

    const data = res.data || {};
    const rolesArr = data.roles || [];
    const roles = new Set(rolesArr);

    console.log('login response:', data);

    // 保存到全局 AuthContext
    try {
      setUser({
        username: data.username,
        roles,
      });
      setIsAuthenticated(true);
    } catch (e2) {
      // 如果这里有问题，让它直接在控制台报错，方便排查
      console.error('设置全局登录状态时出错', e2);
    }

    // 根据角色跳转（如果 roles 里没有 ADMIN，就统一当作员工）
    if (roles.has('ROLE_ADMIN')) {
      navigate('/admin');
    } else {
      navigate('/employee');
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f5f5',
      }}
    >
      <div
        style={{
          width: 420,
          padding: '32px 40px',
          borderRadius: 12,
          background: '#fff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: 8 }}>OA 系统登录</h1>
        <p style={{ textAlign: 'center', marginBottom: 24, color: '#666' }}>
          OA System Login
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>
              用户名 / Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 4,
                border: '1px solid #ccc',
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>
              密码 / Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 4,
                border: '1px solid #ccc',
                fontSize: 14,
              }}
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: 12,
                color: '#d93025',
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px 0',
              borderRadius: 4,
              border: 'none',
              background: '#1677ff',
              color: '#fff',
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            登录 / Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
