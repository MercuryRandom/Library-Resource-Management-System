import React, { useState, useEffect } from 'react';

const SEARCH_FIELDS = [
  { label: '题名', value: 'title' },
  { label: '责任者', value: 'author' },
  { label: '主题词', value: 'theme_word' },
  { label: 'ISBN', value: 'book_id' },
  { label: '分类号', value: 'classification_num' },
  { label: '索书号', value: 'call_num' },
  { label: '出版社', value: 'publisher' },
  { label: '丛书名', value: 'series_title' }
];
const SORT_FIELDS = [
  { label: '出版日期', value: 'publication_date' },
  { label: '题名', value: 'title' },
  { label: '责任者', value: 'author' },
  { label: '出版社', value: 'publisher' }
];

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('catalog'); // 'catalog', 'simple', 'advanced'
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState('publication_date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(false);

  // 简单检索
  const [simpleField, setSimpleField] = useState('title');
  const [simpleKeyword, setSimpleKeyword] = useState('');

  // 多字段检索
  const [advancedFields, setAdvancedFields] = useState({});

  // 馆藏检索请求
  const handleCatalogSearch = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    const res = await fetch('http://localhost:4001/api/books/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keyword: query,
        fields: SEARCH_FIELDS.map(f => f.value),
        sortBy,
        sortOrder,
        page,
        pageSize
      })
    });
    const data = await res.json();
    setResults(data.results || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  // 简单检索请求
  const handleSimpleSearch = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    const res = await fetch('http://localhost:4001/api/books/simple-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        field: simpleField,
        keyword: simpleKeyword,
        sortBy,
        sortOrder,
        page,
        pageSize
      })
    });
    const data = await res.json();
    setResults(data.results || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  // 多字段检索请求
  const handleAdvancedSearch = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    const res = await fetch('http://localhost:4001/api/books/advanced-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conditions: advancedFields,
        sortBy,
        sortOrder,
        page,
        pageSize
      })
    });
    const data = await res.json();
    setResults(data.results || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  // 自动刷新（分页/排序时）
  useEffect(() => {
    if (searchType === 'catalog') handleCatalogSearch();
    if (searchType === 'simple') handleSimpleSearch();
    if (searchType === 'advanced') handleAdvancedSearch();
    // eslint-disable-next-line
  }, [page, pageSize, sortBy, sortOrder]);

  // 切换检索类型时重置分页和结果
  useEffect(() => {
    setResults([]);
    setTotal(0);
    setPage(1);
  }, [searchType]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '60vh', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ width: '100%', background: 'linear-gradient(90deg, #e3eafc 0%, #f5f7fb 100%)', borderRadius: '18px', boxShadow: '0 4px 24px rgba(45,108,223,0.10)', padding: '32px 24px 28px 24px', margin: '24px 0', transition: 'box-shadow 0.25s, transform 0.25s' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 24 }}>
          <button type="button" onClick={() => setSearchType('catalog')} style={{ background: searchType === 'catalog' ? '#2d6cdf' : '#e3eafc', color: searchType === 'catalog' ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer', fontWeight: 600, boxShadow: searchType === 'catalog' ? '0 2px 8px #2d6cdf33' : 'none' }}>馆藏检索</button>
          <button type="button" onClick={() => setSearchType('simple')} style={{ background: searchType === 'simple' ? '#2d6cdf' : '#e3eafc', color: searchType === 'simple' ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer', fontWeight: 600, boxShadow: searchType === 'simple' ? '0 2px 8px #2d6cdf33' : 'none' }}>简单检索</button>
          <button type="button" onClick={() => setSearchType('advanced')} style={{ background: searchType === 'advanced' ? '#2d6cdf' : '#e3eafc', color: searchType === 'advanced' ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer', fontWeight: 600, boxShadow: searchType === 'advanced' ? '0 2px 8px #2d6cdf33' : 'none' }}>多字段检索</button>
        </div>
        {/* 馆藏检索 */}
        {searchType === 'catalog' && (
          <form onSubmit={handleCatalogSearch} style={{ marginBottom: 18 }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="输入任意词、题名、作者、ISBN等..."
              style={{ width: '100%', padding: '12px', fontSize: 16, borderRadius: 8, border: '1.5px solid #bfc8e0', marginBottom: 10, background: '#fff', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <span>排序：</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {SORT_FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                <option value="desc">降序</option>
                <option value="asc">升序</option>
              </select>
              <span>每页</span>
              <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
                {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span>条</span>
              <button type="submit" style={{ marginLeft: 'auto', padding: '8px 18px', borderRadius: 8, background: '#2d6cdf', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15 }}>搜索</button>
            </div>
          </form>
        )}
        {/* 简单检索 */}
        {searchType === 'simple' && (
          <form onSubmit={handleSimpleSearch} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <select value={simpleField} onChange={e => setSimpleField(e.target.value)}>
                {SEARCH_FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              <input
                type="text"
                value={simpleKeyword}
                onChange={e => setSimpleKeyword(e.target.value)}
                placeholder="请输入关键词..."
                style={{ flex: 1, padding: '12px', fontSize: 16, borderRadius: 8, border: '1.5px solid #bfc8e0', background: '#fff', boxSizing: 'border-box' }}
              />
              <button type="submit" style={{ padding: '8px 18px', borderRadius: 8, background: '#2d6cdf', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15 }}>搜索</button>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <span>排序：</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {SORT_FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                <option value="desc">降序</option>
                <option value="asc">升序</option>
              </select>
              <span>每页</span>
              <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
                {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span>条</span>
            </div>
          </form>
        )}
        {/* 多字段检索 */}
        {searchType === 'advanced' && (
          <form onSubmit={handleAdvancedSearch} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
              {SEARCH_FIELDS.map(f => (
                <input
                  key={f.value}
                  type="text"
                  placeholder={f.label}
                  value={advancedFields[f.value] || ''}
                  onChange={e => setAdvancedFields(fields => ({ ...fields, [f.value]: e.target.value }))}
                  style={{ flex: '1 1 180px', minWidth: 120, padding: '12px', fontSize: 16, borderRadius: 8, border: '1.5px solid #bfc8e0', background: '#fff', boxSizing: 'border-box' }}
                />
              ))}
              <button type="submit" style={{ padding: '8px 18px', borderRadius: 8, background: '#2d6cdf', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, minWidth: 80 }}>搜索</button>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <span>排序：</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {SORT_FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                <option value="desc">降序</option>
                <option value="asc">升序</option>
              </select>
              <span>每页</span>
              <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
                {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span>条</span>
            </div>
          </form>
        )}
        {/* 检索结果 */}
        <div style={{ marginTop: 8 }}>
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>检索结果</h3>
          {loading ? <div>加载中...</div> : (
            results.length === 0 ? <div style={{ color: '#888', fontSize: 14 }}>暂无结果。</div> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                <thead>
                  <tr style={{ background: '#f5f7fb' }}>
                    <th>题名</th>
                    <th>作者</th>
                    <th>ISBN</th>
                    <th>出版社</th>
                    <th>出版日期</th>
                    <th>在册数</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(book => (
                    <tr key={book.book_id} style={{ borderBottom: '1px solid #eee' }}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.book_id}</td>
                      <td>{book.publisher}</td>
                      <td>{book.publication_date ? book.publication_date.slice(0, 10) : ''}</td>
                      <td>{book.available_copies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
          {/* 分页 */}
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>上一页</button>
            <span>第 {page} 页 / 共 {Math.ceil(total / pageSize) || 1} 页</span>
            <button disabled={page >= Math.ceil(total / pageSize)} onClick={() => setPage(p => p + 1)}>下一页</button>
            <span style={{ color: '#888', marginLeft: 8 }}>共 {total} 条</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 