import React, { useState } from 'react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // 在这里处理登录逻辑
    if (username && password) {
      alert(`正在使用读者ID: ${username} 登录...`);
      // 登录成功后会跳转到读者主页
    } else {
      alert('请输入读者ID和密码');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>读者登录</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>读者ID</label>
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
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          登录
        </button>
      </form>
    </div>
  );
};

export default LoginPage; 