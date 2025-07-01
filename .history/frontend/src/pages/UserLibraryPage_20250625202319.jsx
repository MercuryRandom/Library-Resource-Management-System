import React from 'react';

const UserLibraryPage = () => {
  return (
    <div>
      <h2 style={{ fontSize: 38, marginBottom: 36, textAlign: 'center' }}>我的图书馆</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40 }}>
        <FeatureCard title="借阅历史查询" desc="查看我的借阅记录和归还情况" icon="📖" />
        <FeatureCard title="图书借阅" desc="在线借阅图书，方便快捷" icon="📚" />
        <FeatureCard title="图书归还" desc="归还已借阅的图书" icon="🔄" />
        <FeatureCard title="预约借书" desc="提前预约心仪的图书" icon="📝" />
      </div>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }) => (
  <div style={{ flex: 1, background: '#f5f7fb', borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: '36px 18px', textAlign: 'center', minWidth: 180 }}>
    <div style={{ fontSize: 48, marginBottom: 18 }}>{icon}</div>
    <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 10 }}>{title}</div>
    <div style={{ color: '#666', fontSize: 18 }}>{desc}</div>
  </div>
);

export default UserLibraryPage; 