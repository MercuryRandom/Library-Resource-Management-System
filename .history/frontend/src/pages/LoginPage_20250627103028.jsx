import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [contact_info, setContactInfo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('http://localhost:4001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_info, password })
    });
    const data = await res.json();
    if (data.success) {
      navigate('/library');
    } else {
      setError(data.message || '手机号或密码错误');
    }
  };

  return (
    <div className="form-card">
      <h2>用户登录</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="contact_info">手机号</label>
        <input
          type="text"
          id="contact_info"
          value={contact_info}
          onChange={(e) => setContactInfo(e.target.value)}
          placeholder="请输入手机号"
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
      <span className="form-link" onClick={() => navigate('/register')}>新用户注册</span>
    </div>
  );
};

export default LoginPage; 