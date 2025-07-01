import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!phone || !password || !confirm || !name || !userType) {
      setError('请填写所有必填信息');
      return;
    }
    if (password !== confirm) {
      setError('两次输入的密码不一致');
      return;
    }
    if (password.length < 6) {
      setError('密码长度至少6位');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact_info: phone,
          password: password,
          name: name,
          gender: gender || null,
          reader_type: userType
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('注册成功，请登录！');
        navigate('/login');
      } else {
        setError(data.message || '注册失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>用户注册</h2>
      <form onSubmit={handleRegister}>
        <label htmlFor="phone">手机号码 *</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="请输入手机号码"
          pattern="[0-9]{11}"
          title="请输入11位手机号码"
        />
        <label htmlFor="name">姓名 *</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入真实姓名"
        />
        <label htmlFor="password">密码 *</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码（至少6位）"
          minLength="6"
        />
        <label htmlFor="confirm">确认密码 *</label>
        <input
          type="password"
          id="confirm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="请再次输入密码"
          minLength="6"
        />
        <label htmlFor="userType">用户类型 *</label>
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
        <label htmlFor="gender">性别（可选）</label>
        <select
          id="gender"
          value={gender}
          onChange={e => setGender(e.target.value)}
          style={{ width: '100%', padding: '14px', fontSize: '1.1em', border: '1px solid #bfc8e0', borderRadius: '8px', marginBottom: '24px', background: '#fff' }}
        >
          <option value="">请选择性别</option>
          <option value="男">男</option>
          <option value="女">女</option>
          <option value="其他">其他</option>
        </select>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? '注册中...' : '注册'}
        </button>
      </form>
      <span className="form-link" onClick={() => navigate('/login')}>已有账号？去登录</span>
    </div>
  );
};

export default RegisterPage; 