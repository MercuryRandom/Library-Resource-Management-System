import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // 这里只做简单演示，实际应有后端校验
    if (username === 'admin' && password === 'admin') {
      alert('管理员登录成功！');
      navigate('/admin');
    } else {
      alert('账号或密码错误');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>管理员登录</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>账号</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>密码</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2d6cdf', color: 'white', border: 'none', borderRadius: '4px' }}>
          登录
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage; 