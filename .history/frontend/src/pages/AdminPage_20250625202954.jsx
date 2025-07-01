import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const adminFeatures = [
  { path: 'readers', title: '读者管理', desc: '添加、修改、删除读者信息', icon: '👤' },
  { path: 'books', title: '图书管理', desc: '添加、修改、删除书目信息', icon: '📚' },
  { path: 'borrowing', title: '借还管理', desc: '借书和还书操作', icon: '🔄' },
];

const AdminPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2 style={{ fontSize: 38, marginBottom: 36, textAlign: 'center' }}>管理员功能</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40, marginBottom: 40 }}>
        {adminFeatures.map(f => (
          <div
            key={f.path}
            className="card-hover"
            style={{ flex: 1, background: '#f5f7fb', borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: '36px 18px', textAlign: 'center', minWidth: 180, cursor: 'pointer' }}
            onClick={() => navigate(f.path)}
          >
            <div style={{ fontSize: 48, marginBottom: 18 }}>{f.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 10 }}>{f.title}</div>
            <div style={{ color: '#666', fontSize: 18 }}>{f.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 40 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage; 