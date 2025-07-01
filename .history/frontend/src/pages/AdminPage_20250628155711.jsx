import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const adminFeatures = [
  { key: 'readers', path: 'readers', title: '读者管理', desc: '添加、修改、删除读者信息', icon: '👤' },
  { key: 'books', path: 'books', title: '图书管理', desc: '添加、修改、删除书目信息', icon: '📚' },
  { key: 'borrowing', path: 'borrowing', title: '借还管理', desc: '借书和还书操作', icon: '🔄' },
  { key: 'admins', path: 'admins', title: '管理员管理', desc: '管理其他管理员账户', icon: '👨‍💼', adminOnly: true },
];

const AdminPage = () => {
  const [selected, setSelected] = useState('readers');
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const navigate = useNavigate();

  // 获取当前管理员信息
  useEffect(() => {
    const fetchCurrentAdmin = async () => {
      try {
        const res = await fetch('http://localhost:4001/api/admin/current');
        if (res.ok) {
          const adminData = await res.json();
          setCurrentAdmin(adminData);
        }
      } catch (error) {
        console.log('获取管理员信息失败:', error);
      }
    };
    fetchCurrentAdmin();
  }, []);

  // 过滤功能列表（高级管理员可以看到所有功能，普通管理员看不到管理员管理）
  const filteredFeatures = adminFeatures.filter(feature => {
    if (feature.adminOnly) {
      return currentAdmin?.privilege_level === '高级管理员';
    }
    return true;
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, marginBottom: 18, textAlign: 'center' }}>管理员功能</h2>
      {currentAdmin && (
        <div style={{ textAlign: 'center', marginBottom: 16, color: '#666' }}>
          当前用户: {currentAdmin.username} ({currentAdmin.privilege_level})
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, marginBottom: 18 }}>
        {filteredFeatures.map(f => (
          <div
            key={f.key}
            className="card-hover"
            style={{ flex: 1, background: selected === f.key ? '#e3eafc' : '#f5f7fb', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '18px 8px', textAlign: 'center', minWidth: 0, maxWidth: 220, margin: '0 8px', cursor: 'pointer', fontSize: 15, border: selected === f.key ? '2px solid #2d6cdf' : '2px solid transparent', fontWeight: 600, transition: 'all 0.2s' }}
            onClick={() => { setSelected(f.key); navigate(f.path); }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
            <div style={{ color: '#666', fontSize: 13 }}>{f.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage; 