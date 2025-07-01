import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [contact, setContact] = useState('');
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username || !password || !confirm || !contact || !userType) {
      setError('请填写所有信息');
      return;
    }
    if (password !== confirm) {
      setError('两次输入的密码不一致');
      return;
    }
    setError('');
    alert('注册成功，请登录！');
    navigate('/login');
  };

  return (
    <div className="form-card">
      <h2>用户注册</h2>
      <form onSubmit={handleRegister}>
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
        <label htmlFor="confirm">确认密码</label>
        <input
          type="password"
          id="confirm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="请再次输入密码"
        />
        <label htmlFor="contact">联系方式</label>
        <input
          type="text"
          id="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="请输入联系方式"
        />
        <label htmlFor="userType">用户类型</label>
        <select
          id="userType"
          value={userType}
          onChange={e => setUserType(e.target.value)}
          style={{ width: '100%', padding: '14px', fontSize: '1.1em', border: '1px solid #bfc8e0', borderRadius: '8px', marginBottom: '24px', background: '#fff' }}
        >
          <option value="">请选择用户类型</option>
          <option value="学生">学生</option>
          <option value="教职工">教职工</option>
        </select>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit">注册</button>
      </form>
      <span className="form-link" onClick={() => navigate('/login')}>已有账号？去登录</span>
    </div>
  );
};

export default RegisterPage; 