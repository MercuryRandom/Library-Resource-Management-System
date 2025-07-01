import React, { useState } from 'react';

const features = [
  { key: 'history', title: '借阅历史查询', desc: '查看我的借阅记录和归还情况', icon: '📖' },
  { key: 'borrow', title: '图书借阅', desc: '在线借阅图书，方便快捷', icon: '📚' },
  { key: 'return', title: '图书归还', desc: '归还已借阅的图书', icon: '🔄' },
  { key: 'reserve', title: '预约借书', desc: '提前预约心仪的图书', icon: '📝' },
];

const featureContent = {
  history: <div style={{ fontSize: 24, marginTop: 24 }}>这里显示借阅历史（示例内容）。</div>,
  borrow: <div style={{ fontSize: 24, marginTop: 24 }}>这里是图书借阅功能（示例内容）。</div>,
  return: <div style={{ fontSize: 24, marginTop: 24 }}>这里是图书归还功能（示例内容）。</div>,
  reserve: <div style={{ fontSize: 24, marginTop: 24 }}>这里是预约借书功能（示例内容）。</div>,
};

const UserLibraryPage = () => {
  const [selected, setSelected] = useState('history');
  return (
    <div>
      <h2 style={{ fontSize: 44, marginBottom: 36, textAlign: 'center' }}>我的图书馆</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40, marginBottom: 40 }}>
        {features.map(f => (
          <FeatureCard key={f.key} {...f} selected={selected === f.key} onClick={() => setSelected(f.key)} />
        ))}
      </div>
      <div>{featureContent[selected]}</div>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon, selected, onClick }) => (
  <div
    className="card-hover"
    style={{
      flex: 1,
      background: selected ? '#e3eafc' : '#f5f7fb',
      borderRadius: 18,
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      padding: '48px 18px',
      textAlign: 'center',
      minWidth: 180,
      cursor: 'pointer',
      fontSize: 28,
      border: selected ? '2.5px solid #2d6cdf' : '2.5px solid transparent',
      fontWeight: 600,
      transition: 'all 0.2s',
    }}
    onClick={onClick}
  >
    <div style={{ fontSize: 60, marginBottom: 22 }}>{icon}</div>
    <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 16 }}>{title}</div>
    <div style={{ color: '#666', fontSize: 22 }}>{desc}</div>
  </div>
);

export default UserLibraryPage; 