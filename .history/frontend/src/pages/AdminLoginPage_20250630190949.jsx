import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('http://localhost:4001/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('adminInfo', JSON.stringify(data.admin));
      navigate('/admin');
    } else {
      setError(data.message || '用户名或密码错误');
    }
  };

  return (
    <div className="form-card">
      <h2>管理员登录</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">用户名</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="请输入用户名"
        />
        <label htmlFor="password">密码</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码"
        />
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit">登录</button>
      </form>
    </div>
  );
};

export default AdminLoginPage; 