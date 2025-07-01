import React, { useState, useEffect } from 'react';

// BookForm component for Add/Edit
const BookForm = ({ book, onSave, onCancel, error }) => {
  const [formData, setFormData] = useState({
    title: '', author: '', publisher: '', publication_date: '', total_copies: 1, available_copies: 1, theme_word: '', classification_num: '', call_num: '', series_title: '',
    ...book
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 10, padding: 32, minWidth: 400, boxShadow: '0 4px 24px #0002', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <h3 style={{ width: '100%', marginTop: 0 }}>{book ? '修改图书' : '添加图书'}</h3>
        <div style={{ flex: '1 1 45%' }}><label>ISBN (book_id)</label><input name="book_id" value={formData.book_id || ''} onChange={handleChange} required disabled={!!book} /></div>
        <div style={{ flex: '1 1 45%' }}><label>题名 (title)</label><input name="title" value={formData.title} onChange={handleChange} required /></div>
        <div style={{ flex: '1 1 45%' }}><label>作者 (author)</label><input name="author" value={formData.author} onChange={handleChange} required /></div>
        <div style={{ flex: '1 1 45%' }}><label>出版社 (publisher)</label><input name="publisher" value={formData.publisher} onChange={handleChange} /></div>
        <div style={{ flex: '1 1 45%' }}><label>出版日期 (publication_date)</label><input type="date" name="publication_date" value={formData.publication_date ? formData.publication_date.slice(0, 10) : ''} onChange={handleChange} /></div>
        <div style={{ flex: '1 1 45%' }}><label>总册数 (total_copies)</label><input type="number" name="total_copies" value={formData.total_copies} onChange={handleChange} required /></div>
        <div style={{ flex: '1 1 45%' }}><label>在册数 (available_copies)</label><input type="number" name="available_copies" value={formData.available_copies} onChange={handleChange} required /></div>
        <div style={{ flex: '1 1 45%' }}><label>主题词 (theme_word)</label><input name="theme_word" value={formData.theme_word} onChange={handleChange} /></div>
        <div style={{ flex: '1 1 45%' }}><label>分类号 (classification_num)</label><input name="classification_num" value={formData.classification_num} onChange={handleChange} /></div>
        <div style={{ flex: '1 1 45%' }}><label>索书号 (call_num)</label><input name="call_num" value={formData.call_num} onChange={handleChange} /></div>
        <div style={{ flex: '1 1 45%' }}><label>丛书名 (series_title)</label><input name="series_title" value={formData.series_title} onChange={handleChange} /></div>
        {error && <div style={{ width: '100%', color: 'red' }}>{error}</div>}
        <div style={{ width: '100%', display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
          <button type="button" onClick={onCancel}>取消</button>
          <button type="submit">保存</button>
        </div>
      </form>
    </div>
  );
};

const BookManagementPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({ open: false, book: null, error: '' });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4001/api/books');
      const data = await res.json();
      setBooks(data);
    } catch {
      setError('获取图书列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSave = async (formData) => {
    const isEdit = !!formState.book;
    const url = isEdit ? `http://localhost:4001/api/admin/books/${formState.book.book_id}` : 'http://localhost:4001/api/admin/books';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setFormState({ open: false, book: null, error: '' });
        fetchBooks();
      } else {
        setFormState({ ...formState, error: data.message || '保存失败' });
      }
    } catch {
      setFormState({ ...formState, error: '请求失败' });
    }
  };

  const handleDelete = async (book_id) => {
    if (window.confirm(`确认删除图书 ${book_id} 吗？`)) {
      try {
        const res = await fetch(`http://localhost:4001/api/admin/books/${book_id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchBooks();
        } else {
          alert(data.message || '删除失败');
        }
      } catch {
        alert('删除失败');
      }
    }
  };

  return (
    <div>
      <h3>图书管理</h3>
      <button onClick={() => setFormState({ open: true, book: null, error: '' })}>添加图书</button>
      {loading ? <div>加载中...</div> : error ? <div>{error}</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', marginTop: 10 }}>
            <thead>
              <tr>
                <th>ISBN</th>
                <th>题名</th>
                <th>作者</th>
                <th>出版社</th>
                <th>在册/总数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b.book_id}>
                  <td>{b.book_id}</td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.publisher}</td>
                  <td>{b.available_copies}/{b.total_copies}</td>
                  <td>
                    <button onClick={() => setFormState({ open: true, book: b, error: '' })}>修改</button>
                    <button onClick={() => handleDelete(b.book_id)}>删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {formState.open && <BookForm book={formState.book} onSave={handleSave} onCancel={() => setFormState({ open: false, book: null, error: '' })} error={formState.error} />}
    </div>
  );
};

export default BookManagementPage; 