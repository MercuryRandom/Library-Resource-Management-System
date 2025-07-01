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
      <h1>欢迎来到图书资源管理系统</h1>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <RecommendationList title="热门借阅榜" books={popularBorrowings} />
        <RecommendationList title="热门评分榜" books={popularRatings} />
        <RecommendationList title="热门收藏榜" books={popularCollections} />
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>新书通报</h2>
        <p>这里将展示各类新书...</p>
      </div>
    </div>
  );
};

// 一个可重用的列表组件
const RecommendationList = ({ title, books }) => (
  <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', width: '30%' }}>
    <h3>{title}</h3>
    <ul>
      {books.map(book => (
        <li key={book.id}>
          <strong>{book.title}</strong> - <em>{book.author}</em>
        </li>
      ))}
    </ul>
  </div>
);

export default HomePage; 