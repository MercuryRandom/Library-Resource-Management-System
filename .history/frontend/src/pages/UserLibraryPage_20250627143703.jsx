import React, { useState, useEffect } from 'react';

const features = [
  { key: 'history', title: '借阅历史查询', desc: '查看我的借阅记录和归还情况', icon: '📖' },
  { key: 'borrow', title: '图书借阅', desc: '在线借阅图书，方便快捷', icon: '📚' },
  { key: 'return', title: '图书归还', desc: '归还已借阅的图书', icon: '🔄' },
  { key: 'reserve', title: '预约借书', desc: '提前预约心仪的图书', icon: '📝' },
];

const UserLibraryPage = () => {
  const [selected, setSelected] = useState('history');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 借书相关
  const [books, setBooks] = useState([]);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [borrowMsg, setBorrowMsg] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [borrowQuery, setBorrowQuery] = useState('');

  // 归还相关
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnMsg, setReturnMsg] = useState('');
  const [unreturned, setUnreturned] = useState([]);

  // 获取当前登录用户
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const reader_id = user.reader_id;

  // 借阅历史
  useEffect(() => {
    if (selected === 'history' && reader_id) {
      setLoading(true);
      setError('');
      fetch(`http://localhost:4001/api/history/${reader_id}`)
        .then(res => res.json())
        .then(data => {
          setHistory(data);
          setLoading(false);
        })
        .catch(() => {
          setError('获取借阅历史失败');
          setLoading(false);
        });
    }
  }, [selected, reader_id]);

  // 加载可借图书（支持检索）
  useEffect(() => {
    if (selected === 'borrow') {
      setBorrowLoading(true);
      setBorrowMsg('');
      let url = 'http://localhost:4001/api/books';
      // 如果有检索关键词，使用模糊检索API
      if (borrowQuery.trim()) {
        url = 'http://localhost:4001/api/books/search';
      }
      const fetchBooks = async () => {
        if (borrowQuery.trim()) {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              keyword: borrowQuery,
              fields: ['title', 'author', 'book_id'],
              page: 1,
              pageSize: 100,
            })
          });
          const data = await res.json();
          setBooks((data.results || []).filter(b => b.available_copies > 0));
        } else {
          const res = await fetch(url);
          const data = await res.json();
          setBooks(data.filter(b => b.available_copies > 0));
        }
        setBorrowLoading(false);
      };
      fetchBooks().catch(() => {
        setBorrowMsg('获取图书失败');
        setBorrowLoading(false);
      });
    }
  }, [selected, borrowQuery]);

  // 加载未归还图书
  useEffect(() => {
    if (selected === 'return' && reader_id) {
      setReturnLoading(true);
      setReturnMsg('');
      fetch(`http://localhost:4001/api/history/${reader_id}`)
        .then(res => res.json())
        .then(data => {
          setUnreturned((data || []).filter(item => !item.return_date));
          setReturnLoading(false);
        })
        .catch(() => {
          setReturnMsg('获取未归还图书失败');
          setReturnLoading(false);
        });
    }
  }, [selected, reader_id]);

  // 借书操作
  const handleBorrow = async (book_id) => {
    if (!dueDate) {
      setBorrowMsg('请选择应还日期');
      return;
    }
    setBorrowLoading(true);
    setBorrowMsg('');
    const today = new Date();
    const borrow_date = today.toISOString().slice(0, 10);
    try {
      const res = await fetch('http://localhost:4001/api/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reader_id,
          book_id,
          borrow_date,
          due_date: dueDate
        })
      });
      const data = await res.json();
      if (data.success) {
        setBorrowMsg('借书成功！');
        setSelected('history'); // 借阅成功后自动跳转到历史
      } else {
        setBorrowMsg(data.message || '借书失败');
      }
    } catch {
      setBorrowMsg('借书失败，请重试');
    } finally {
      setBorrowLoading(false);
    }
  };

  // 归还操作
  const handleReturn = async (borrow_id) => {
    setReturnLoading(true);
    setReturnMsg('');
    const return_date = new Date().toISOString().slice(0, 10);
    try {
      const res = await fetch('http://localhost:4001/api/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ borrow_id, return_date })
      });
      const data = await res.json();
      if (data.success) {
        setReturnMsg('归还成功！');
        setSelected('history'); // 归还后跳转到历史
      } else {
        setReturnMsg(data.message || '归还失败');
      }
    } catch {
      setReturnMsg('归还失败，请重试');
    } finally {
      setReturnLoading(false);
    }
  };

  const featureContent = {
    history: (
      <div style={{ fontSize: 16, marginTop: 16 }}>
        {loading ? '加载中...' : error ? <span style={{ color: 'red' }}>{error}</span> : (
          history.length === 0 ? <div style={{ color: '#888' }}>暂无借阅记录。</div> : (
            <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f7fb' }}>
                  <th>借书ID</th>
                  <th>ISBN</th>
                  <th>借书日期</th>
                  <th>应还日期</th>
                  <th>归还日期</th>
                </tr>
              </thead>
              <tbody>
                {history.map(item => (
                  <tr key={item.borrow_id} style={{ borderBottom: '1px solid #eee' }}>
                    <td>{item.borrow_id}</td>
                    <td>{item.book_id}</td>
                    <td>{item.borrow_date ? item.borrow_date.slice(0, 10) : ''}</td>
                    <td>{item.due_date ? item.due_date.slice(0, 10) : ''}</td>
                    <td>{item.return_date ? item.return_date.slice(0, 10) : <span style={{ color: '#e67e22' }}>未归还</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    ),
    borrow: (
      <div style={{ fontSize: 16, marginTop: 16 }}>
        <div style={{ marginBottom: 10 }}>
          <input
            type="text"
            value={borrowQuery}
            onChange={e => setBorrowQuery(e.target.value)}
            placeholder="请输入题名、作者或ISBN进行检索"
            style={{ width: 260, padding: '8px', fontSize: 15, borderRadius: 8, border: '1.5px solid #bfc8e0', marginRight: 16 }}
          />
          <label>应还日期：</label>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ marginRight: 16 }} />
          <span style={{ color: '#888', fontSize: 13 }}>（借书时需选择应还日期）</span>
        </div>
        {borrowMsg && <div style={{ color: borrowMsg.includes('成功') ? 'green' : 'red', marginBottom: 10 }}>{borrowMsg}</div>}
        {borrowLoading ? '加载中...' : (
          books.length === 0 ? <div style={{ color: '#888' }}>暂无可借图书。</div> : (
            <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f7fb' }}>
                  <th>ISBN</th>
                  <th>题名</th>
                  <th>作者</th>
                  <th>出版社</th>
                  <th>在册数</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.book_id} style={{ borderBottom: '1px solid #eee' }}>
                    <td>{book.book_id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.publisher}</td>
                    <td>{book.available_copies}</td>
                    <td>
                      <button onClick={() => handleBorrow(book.book_id)} disabled={borrowLoading || !dueDate} style={{ padding: '4px 12px', borderRadius: 6, background: '#2d6cdf', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>借阅</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    ),
    return: (
      <div style={{ fontSize: 16, marginTop: 16 }}>
        {returnMsg && <div style={{ color: returnMsg.includes('成功') ? 'green' : 'red', marginBottom: 10 }}>{returnMsg}</div>}
        {returnLoading ? '加载中...' : (
          unreturned.length === 0 ? <div style={{ color: '#888' }}>暂无未归还图书。</div> : (
            <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f7fb' }}>
                  <th>借书ID</th>
                  <th>ISBN</th>
                  <th>借书日期</th>
                  <th>应还日期</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {unreturned.map(item => (
                  <tr key={item.borrow_id} style={{ borderBottom: '1px solid #eee' }}>
                    <td>{item.borrow_id}</td>
                    <td>{item.book_id}</td>
                    <td>{item.borrow_date ? item.borrow_date.slice(0, 10) : ''}</td>
                    <td>{item.due_date ? item.due_date.slice(0, 10) : ''}</td>
                    <td>
                      <button onClick={() => handleReturn(item.borrow_id)} disabled={returnLoading} style={{ padding: '4px 12px', borderRadius: 6, background: '#2d6cdf', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>归还</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    ),
    reserve: <div style={{ fontSize: 16, marginTop: 16 }}>这里是预约借书功能（示例内容）。</div>,
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, marginBottom: 18, textAlign: 'center' }}>我的图书馆</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, marginBottom: 18 }}>
        {features.map(f => (
          <FeatureCard key={f.key} {...f} selected={selected === f.key} onClick={() => setSelected(f.key)} />
        ))}
      </div>
      <div>{featureContent[selected]}</div>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon, selected, onClick }) => (
  <div
    className="card-hover"
    style={{
      flex: 1,
      background: selected ? '#e3eafc' : '#f5f7fb',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      padding: '18px 8px',
      textAlign: 'center',
      minWidth: 0,
      maxWidth: 220,
      margin: '0 8px',
      cursor: 'pointer',
      fontSize: 15,
      border: selected ? '2px solid #2d6cdf' : '2px solid transparent',
      fontWeight: 600,
      transition: 'all 0.2s',
    }}
    onClick={onClick}
  >
    <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{title}</div>
    <div style={{ color: '#666', fontSize: 13 }}>{desc}</div>
  </div>
);

export default UserLibraryPage; 