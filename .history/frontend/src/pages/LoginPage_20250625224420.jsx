import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'root' && password === '123456') {
      setError('');
      navigate('/library');
    } else {
      setError('密码错误，请联系管理员');
    }
  };

  return (
    <div className="form-card">
      <h2>用户登录</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">账号</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="请输入账号"
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