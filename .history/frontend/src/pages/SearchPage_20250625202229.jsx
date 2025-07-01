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
    <div className="form-card" style={{ maxWidth: '700px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32 }}>书目检索</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
        <button type="button" onClick={() => setSearchType('simple')} style={{ background: searchType === 'simple' ? '#2d6cdf' : '#e3eafc', color: searchType === 'simple' ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 20, cursor: 'pointer' }}>简单检索</button>
        <button type="button" onClick={() => setSearchType('advanced')} style={{ background: searchType === 'advanced' ? '#2d6cdf' : '#e3eafc', color: searchType === 'advanced' ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 20, cursor: 'pointer' }}>多字段组合检索</button>
      </div>
      <form onSubmit={handleSearch}>
        {searchType === 'simple' ? (
          <div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入书名、作者或关键词..."
              style={{ width: '100%', padding: '16px', fontSize: 20, borderRadius: 8, border: '1px solid #bfc8e0', marginBottom: 24 }}
            />
          </div>
        ) : (
          <div>
            <p style={{ color: '#888', marginBottom: 16 }}>多字段组合检索功能待开发。</p>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="多字段检索..."
              style={{ width: '100%', padding: '16px', fontSize: 20, borderRadius: 8, border: '1px solid #bfc8e0', marginBottom: 24 }}
              disabled
            />
          </div>
        )}
        <button type="submit" style={{ width: '100%', padding: '16px', fontSize: 22, background: '#2d6cdf', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          搜索
        </button>
      </form>
      <div style={{ marginTop: '36px' }}>
        <h3 style={{ fontSize: 26, marginBottom: 12 }}>搜索结果</h3>
        {/* 搜索结果将在这里显示 */}
        <p style={{ color: '#888' }}>暂无结果。</p>
      </div>
    </div>
  );
};

export default SearchPage; 