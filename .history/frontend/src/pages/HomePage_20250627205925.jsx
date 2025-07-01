import React, { useEffect, useState, useRef } from 'react';

const HomePage = () => {
  const [popularBorrow, setPopularBorrow] = useState([]);
  const [popularRating, setPopularRating] = useState([]);
  const [popularCollect, setPopularCollect] = useState([]);
  const [newBooks, setNewBooks] = useState({});
  const [category, setCategory] = useState('');
  const timerRef = useRef();

  useEffect(() => {
    fetch('http://localhost:4001/api/recommend/popular-borrow').then(r => r.json()).then(setPopularBorrow);
    fetch('http://localhost:4001/api/recommend/popular-rating').then(r => r.json()).then(setPopularRating);
    fetch('http://localhost:4001/api/recommend/popular-collect').then(r => r.json()).then(setPopularCollect);
    fetch('http://localhost:4001/api/recommend/new-books').then(r => r.json()).then(data => {
      setNewBooks(data);
      const cats = Object.keys(data);
      if (cats.length > 0) setCategory(cats[0]);
    });
  }, []);

  // 自动轮播分类
  useEffect(() => {
    timerRef.current && clearInterval(timerRef.current);
    const cats = Object.keys(newBooks);
    if (!category || cats.length === 0) return;
    let idx = cats.indexOf(category);
    timerRef.current = setInterval(() => {
      idx = (idx + 1) % cats.length;
      setCategory(cats[idx]);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [category, newBooks]);

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
        <RecommendationList title="热门借阅榜" icon="🔥" books={popularBorrow} color="#ffe6e6" type="borrow" />
        <RecommendationList title="热门评分榜" icon="⭐" books={popularRating} color="#e6f7ff" type="rating" />
        <RecommendationList title="热门收藏榜" icon="💖" books={popularCollect} color="#f9fbe7" type="collect" />
      </div>

      <div style={{ marginTop: '24px', background: '#f5f7fb', borderRadius: 12, padding: '18px 24px' }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>新书通报</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 10 }}>
          {Object.keys(newBooks).map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              background: cat === category ? '#2d6cdf' : '#fff',
              color: cat === category ? '#fff' : '#2d6cdf',
              border: '1.5px solid #2d6cdf',
              borderRadius: 8,
              padding: '4px 16px',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              marginRight: 4
            }}>{cat}</button>
          ))}
        </div>
        <div>
          {(newBooks[category] || []).length === 0 ? <div style={{ color: '#888' }}>暂无新书。</div> : (
            <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', gap: 18 }}>
              {newBooks[category].map(book => (
                <li key={book.book_id} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 16, minWidth: 160 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{book.title}</div>
                  <div style={{ color: '#888', fontSize: 14, margin: '6px 0' }}>{book.author}</div>
                  <div style={{ fontSize: 13 }}>ISBN: {book.book_id}</div>
                  <div style={{ fontSize: 13 }}>出版: {book.publisher}</div>
                  <div style={{ fontSize: 13 }}>出版日期: {book.publication_date ? book.publication_date.slice(0, 10) : ''}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// 可重用榜单组件
const RecommendationList = ({ title, icon, books, color, type }) => (
  <div className="card-hover" style={{ background: color, borderRadius: 12, padding: '18px 10px', width: '32%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'box-shadow 0.25s, transform 0.25s', minWidth: 0 }}>
    <h3 style={{ fontSize: 18, marginBottom: 10 }}>{icon} {title}</h3>
    <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: 15 }}>
      {books.map(book => (
        <li key={book.book_id || book.id} style={{ marginBottom: 8 }}>
          <strong>{book.title}</strong> <span style={{ color: '#888', fontSize: 13 }}>- {book.author}</span>
          {type === 'borrow' && <span style={{ color: '#e67e22', marginLeft: 8 }}>借阅 {book.borrow_count || 0} 次</span>}
          {type === 'rating' && <span style={{ color: '#f7b500', marginLeft: 8 }}>评分 {book.rating || 0} 分</span>}
          {type === 'collect' && <span style={{ color: '#2d6cdf', marginLeft: 8 }}>收藏 {book.reservation_count || book.collect_count || 0} 次</span>}
        </li>
      ))}
    </ul>
  </div>
);

export default HomePage; 