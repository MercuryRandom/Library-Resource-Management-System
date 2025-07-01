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
    <div>
      <h2>书目检索</h2>

      <div>
        <button onClick={() => setSearchType('simple')}>简单检索</button>
        <button onClick={() => setSearchType('advanced')}>多字段组合检索</button>
      </div>

      <hr />

      <form onSubmit={handleSearch}>
        {searchType === 'simple' ? (
          <div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入书名、作者或关键词..."
              style={{ width: '300px', padding: '8px' }}
            />
          </div>
        ) : (
          <div>
            {/* 未来在这里添加多字段检索的表单 */}
            <p>多字段组合检索功能待开发。</p>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="多字段检索..."
              style={{ width: '300px', padding: '8px' }}
              disabled
            />
          </div>
        )}
        <button type="submit" style={{ padding: '8px 16px', marginTop: '10px' }}>
          搜索
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <h3>搜索结果</h3>
        {/* 搜索结果将在这里显示 */}
        <p>暂无结果。</p>
      </div>
    </div>
  );
};

export default SearchPage; 