import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const adminFeatures = [
  { key: 'readers', path: 'readers', title: '读者管理', desc: '添加、修改、删除读者信息', icon: '👤' },
  { key: 'books', path: 'books', title: '图书管理', desc: '添加、修改、删除书目信息', icon: '📚' },
  { key: 'borrowing', path: 'borrowing', title: '借还管理', desc: '借书和还书操作', icon: '🔄' },
];

// const featureContent = {
//   readers: <div style={{ fontSize: 24, marginTop: 24 }}>这里是读者管理功能（示例内容）。</div>,
//   books: <div style={{ fontSize: 24, marginTop: 24 }}>这里是图书管理功能（示例内容）。</div>,
//   borrowing: <div style={{ fontSize: 24, marginTop: 24 }}>这里是借还管理功能（示例内容）。</div>,
// };

const AdminPage = () => {
  const [selected, setSelected] = useState('readers');
  const navigate = useNavigate();
  return (
    <div>
      <h2 style={{ fontSize: 44, marginBottom: 36, textAlign: 'center' }}>管理员功能</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40, marginBottom: 40 }}>
        {adminFeatures.map(f => (
          <div
            key={f.key}
            className="card-hover"
            style={{ flex: 1, background: selected === f.key ? '#e3eafc' : '#f5f7fb', borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: '48px 18px', textAlign: 'center', minWidth: 180, cursor: 'pointer', fontSize: 28, border: selected === f.key ? '2.5px solid #2d6cdf' : '2.5px solid transparent', fontWeight: 600, transition: 'all 0.2s' }}
            onClick={() => { setSelected(f.key); navigate(f.path); }}
          >
            <div style={{ fontSize: 60, marginBottom: 22 }}>{f.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 16 }}>{f.title}</div>
            <div style={{ color: '#666', fontSize: 22 }}>{f.desc}</div>
          </div>
        ))}
      </div>
      <div>{featureContent[selected]}</div>
      <div style={{ marginTop: 40 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage; 