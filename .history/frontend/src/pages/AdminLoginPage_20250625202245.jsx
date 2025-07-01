import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setError('');
      alert('管理员登录成功！');
      navigate('/admin');
    } else {
      setError('账号或密码错误');
    }
  };

  return (
    <div className="form-card">
      <h2>管理员登录</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">账号</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="请输入管理员账号"
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