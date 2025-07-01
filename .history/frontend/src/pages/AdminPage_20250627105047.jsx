import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const adminFeatures = [
  { key: 'readers', path: 'readers', title: '读者管理', desc: '添加、修改、删除读者信息', icon: '👤' },
  { key: 'books', path: 'books', title: '图书管理', desc: '添加、修改、删除书目信息', icon: '📚' },
  { key: 'borrowing', path: 'borrowing', title: '借还管理', desc: '借书和还书操作', icon: '🔄' },
];

const featureContent = {
  readers: <div style={{ fontSize: 16, marginTop: 16 }}>这里是读者管理功能（示例内容）。</div>,
  books: <div style={{ fontSize: 16, marginTop: 16 }}>这里是图书管理功能（示例内容）。</div>,
  borrowing: <div style={{ fontSize: 16, marginTop: 16 }}>这里是借还管理功能（示例内容）。</div>,
};

const AdminPage = () => {
  const [selected, setSelected] = useState('readers');
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, marginBottom: 18, textAlign: 'center' }}>管理员功能</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, marginBottom: 18 }}>
        {adminFeatures.map(f => (
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
      <div>{featureContent[selected]}</div>
      <div style={{ marginTop: 18 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage; 