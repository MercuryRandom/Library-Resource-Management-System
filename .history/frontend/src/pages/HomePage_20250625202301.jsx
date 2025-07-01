import React from 'react';

const HomePage = () => {
  // 假设这些是-从后端获取的数据
  const popularBorrowings = [
    { id: 1, title: '三体', author: '刘慈欣' },
    { id: 2, title: '活着', author: '余华' },
    { id: 3, title: '百年孤独', author: '加西亚·马尔克斯' },
  ];

  const popularRatings = [
    { id: 1, title: 'SICP', author: 'Harold Abelson' },
    { id: 2, title: '代码整洁之道', author: 'Robert C. Martin' },
    { id: 3, title: '设计模式', author: 'Erich Gamma' },
  ];

  const popularCollections = [
    { id: 1, title: '深入理解计算机系统', author: 'Randal E. Bryant' },
    { id: 2, title: '算法导论', author: 'Thomas H. Cormen' },
    { id: 3, title: '鸟哥的Linux私房菜', author: '鸟哥' },
  ];

  return (
    <div>
      <div style={{
        background: 'linear-gradient(90deg, #2d6cdf 0%, #5ea3f7 100%)',
        color: '#fff',
        borderRadius: '24px',
        padding: '48px 40px 40px 60px',
        marginBottom: 48,
        boxShadow: '0 4px 32px rgba(45,108,223,0.10)',
        display: 'flex',
        alignItems: 'center',
        gap: 40
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 54, fontWeight: 700, margin: 0, letterSpacing: 2 }}>图书资源管理系统</h1>
          <p style={{ fontSize: 28, margin: '32px 0 0 0', lineHeight: 1.5 }}>
            智能检索 · 热门推荐 · 新书速递<br />
            让每一本书都能被发现和利用！
          </p>
        </div>
        <div style={{ fontSize: 90, opacity: 0.15, userSelect: 'none' }}>📚</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 32, marginBottom: 48 }}>
        <RecommendationList title="热门借阅榜" icon="🔥" books={popularBorrowings} color="#ffe6e6" />
        <RecommendationList title="热门评分榜" icon="⭐" books={popularRatings} color="#e6f7ff" />
        <RecommendationList title="热门收藏榜" icon="💖" books={popularCollections} color="#f9fbe7" />
      </div>

      <div style={{ marginTop: '40px', background: '#f5f7fb', borderRadius: 18, padding: '32px 40px' }}>
        <h2 style={{ fontSize: 32, marginBottom: 18 }}>新书通报</h2>
        <p style={{ color: '#666', fontSize: 22 }}>这里将展示各类新书...</p>
      </div>
    </div>
  );
};

// 一个可重用的列表组件
const RecommendationList = ({ title, icon, books, color }) => (
  <div style={{ background: color, borderRadius: 18, padding: '28px 24px', width: '32%', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
    <h3 style={{ fontSize: 26, marginBottom: 18 }}>{icon} {title}</h3>
    <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: 20 }}>
      {books.map(book => (
        <li key={book.id} style={{ marginBottom: 12 }}>
          <strong>{book.title}</strong> <span style={{ color: '#888', fontSize: 18 }}>- {book.author}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default HomePage; 