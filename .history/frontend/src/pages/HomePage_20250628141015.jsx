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
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{
        background: 'linear-gradient(90deg, #2d6cdf 0%, #5ea3f7 100%)',
        color: '#fff',
        borderRadius: '18px',
        padding: '32px 24px 28px 36px',
        marginBottom: 32,
        boxShadow: '0 4px 24px rgba(45,108,223,0.10)',
        display: 'flex',
        alignItems: 'center',
        gap: 24
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 38, fontWeight: 800, margin: 0, letterSpacing: 1 }}>图书资源管理系统</h1>
          <p style={{ fontSize: 20, margin: '18px 0 0 0', lineHeight: 1.5 }}>
            智能检索 · 热门推荐 · 新书速递<br />
            让每一本书都能被发现和利用！
          </p>
        </div>
        <div style={{ fontSize: 60, opacity: 0.13, userSelect: 'none' }}>📚</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, marginBottom: 32 }}>
        <RecommendationList title="热门借阅榜" icon="🔥" books={popularBorrowings} color="#ffe6e6" />
        <RecommendationList title="热门评分榜" icon="⭐" books={popularRatings} color="#e6f7ff" />
        <RecommendationList title="热门收藏榜" icon="💖" books={popularCollections} color="#f9fbe7" />
      </div>

      <div style={{ marginTop: '24px', background: '#f5f7fb', borderRadius: 12, padding: '18px 24px' }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>新书通报</h2>
        <p style={{ color: '#666', fontSize: 16 }}>这里将展示各类新书...</p>
      </div>
    </div>
  );
};

// 一个可重用的列表组件
const RecommendationList = ({ title, icon, books, color }) => (
  <div className="card-hover" style={{ background: color, borderRadius: 12, padding: '18px 10px', width: '32%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'box-shadow 0.25s, transform 0.25s', minWidth: 0 }}>
    <h3 style={{ fontSize: 18, marginBottom: 10 }}>{icon} {title}</h3>
    <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: 15 }}>
      {books.map(book => (
        <li key={book.id} style={{ marginBottom: 8 }}>
          <strong>{book.title}</strong> <span style={{ color: '#888', fontSize: 13 }}>- {book.author}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default HomePage; 