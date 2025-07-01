import React, { useState } from 'react';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('simple'); // 'simple' or 'advanced'

  const handleSearch = (e) => {
    e.preventDefault();
    // 在这里处理搜索逻辑
    console.log(`Searching for "${query}" with type "${searchType}"`);
    alert(`正在搜索: ${query}`);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '60vh' }}>
      <div style={{ maxWidth: '900px', width: '100%', background: 'linear-gradient(90deg, #e3eafc 0%, #f5f7fb 100%)', borderRadius: '32px', boxShadow: '0 8px 48px rgba(45,108,223,0.10)', padding: '64px 60px 60px 60px', margin: '40px 0', transition: 'box-shadow 0.25s, transform 0.25s' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 40, fontSize: 38, fontWeight: 700, letterSpacing: 1 }}>书目检索</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 40 }}>
          <button type="button" onClick={() => setSearchType('simple')} style={{ background: searchType === 'simple' ? '#2d6cdf' : '#e3eafc', color: searchType === 'simple' ? '#fff' : '#222', border: 'none', borderRadius: 12, padding: '16px 48px', fontSize: 24, cursor: 'pointer', fontWeight: 600, boxShadow: searchType === 'simple' ? '0 2px 12px #2d6cdf33' : 'none' }}>简单检索</button>
          <button type="button" onClick={() => setSearchType('advanced')} style={{ background: searchType === 'advanced' ? '#2d6cdf' : '#e3eafc', color: searchType === 'advanced' ? '#fff' : '#222', border: 'none', borderRadius: 12, padding: '16px 48px', fontSize: 24, cursor: 'pointer', fontWeight: 600, boxShadow: searchType === 'advanced' ? '0 2px 12px #2d6cdf33' : 'none' }}>多字段组合检索</button>
        </div>
        <form onSubmit={handleSearch}>
          {searchType === 'simple' ? (
            <div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="输入书名、作者或关键词..."
                style={{ width: '100%', padding: '22px', fontSize: 24, borderRadius: 12, border: '1.5px solid #bfc8e0', marginBottom: 32, background: '#fff', boxSizing: 'border-box' }}
              />
            </div>
          ) : (
            <div>
              <p style={{ color: '#888', marginBottom: 20, fontSize: 20 }}>多字段组合检索功能待开发。</p>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="多字段检索..."
                style={{ width: '100%', padding: '22px', fontSize: 24, borderRadius: 12, border: '1.5px solid #bfc8e0', marginBottom: 32, background: '#fff', boxSizing: 'border-box' }}
                disabled
              />
            </div>
          )}
          <button type="submit" style={{ width: '100%', padding: '22px', fontSize: 26, background: '#2d6cdf', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 700, letterSpacing: 2, boxShadow: '0 2px 12px #2d6cdf33' }}>
            搜索
          </button>
        </form>
        <div style={{ marginTop: '48px' }}>
          <h3 style={{ fontSize: 30, marginBottom: 18 }}>搜索结果</h3>
          {/* 搜索结果将在这里显示 */}
          <p style={{ color: '#888', fontSize: 22 }}>暂无结果。</p>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 