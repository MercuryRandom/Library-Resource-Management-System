import React, { useState, useEffect } from 'react';

const BorrowManagementPage = () => {
  const [unreturnedBooks, setUnreturnedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [returnMsg, setReturnMsg] = useState('');

  // 获取所有未归还的图书
  const fetchUnreturnedBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:4001/api/admin/unreturned-books');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUnreturnedBooks(data);
    } catch (err) {
      console.error('获取未归还图书失败:', err);
      setError('获取未归还图书失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreturnedBooks();
  }, []);

  // 归还图书
  const handleReturn = async (borrow_id) => {
    if (!window.confirm('确认归还这本书吗？')) return;

    setReturnMsg('');
    try {
      const res = await fetch('http://localhost:4001/api/admin/return-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ borrow_id })
      });
      const data = await res.json();
      if (data.success) {
        setReturnMsg('归还成功！');
        // 刷新列表
        fetchUnreturnedBooks();
        // 3秒后清除消息
        setTimeout(() => setReturnMsg(''), 3000);
      } else {
        setReturnMsg(data.message || '归还失败');
      }
    } catch (err) {
      setReturnMsg('归还失败，请重试');
    }
  };

  // 检查是否逾期
  const isOverdue = (due_date) => {
    const today = new Date();
    const due = new Date(due_date);
    return today > due;
  };

  return (
    <div>
      <h3>借还管理</h3>
      <p style={{ color: '#666', marginBottom: 20 }}>管理所有用户的借还情况，可查看未归还图书并进行归还操作。</p>

      {returnMsg && (
        <div style={{
          color: returnMsg.includes('成功') ? 'green' : 'red',
          marginBottom: 10,
          padding: '8px 12px',
          background: returnMsg.includes('成功') ? '#e8f5e8' : '#ffe8e8',
          borderRadius: 6,
          border: `1px solid ${returnMsg.includes('成功') ? '#4caf50' : '#f44336'}`
        }}>
          {returnMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>加载中...</div>
      ) : error ? (
        <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>{error}</div>
      ) : unreturnedBooks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>暂无未归还的图书</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ background: '#f5f7fb' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>借书ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>读者信息</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>图书信息</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>借书日期</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>应还日期</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>状态</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {unreturnedBooks.map(book => (
                <tr key={book.borrow_id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px' }}>{book.borrow_id}</td>
                  <td style={{ padding: '12px' }}>
                    <div><strong>{book.reader_name}</strong></div>
                    <div style={{ fontSize: 13, color: '#666' }}>{book.reader_id} ({book.reader_type})</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div><strong>{book.title}</strong></div>
                    <div style={{ fontSize: 13, color: '#666' }}>{book.author} - {book.book_id}</div>
                  </td>
                  <td style={{ padding: '12px' }}>{book.borrow_date ? book.borrow_date.slice(0, 10) : ''}</td>
                  <td style={{ padding: '12px' }}>{book.due_date ? book.due_date.slice(0, 10) : ''}</td>
                  <td style={{ padding: '12px' }}>
                    {isOverdue(book.due_date) ? (
                      <span style={{ color: '#f44336', fontWeight: 600 }}>已逾期</span>
                    ) : (
                      <span style={{ color: '#4caf50' }}>正常</span>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => handleReturn(book.borrow_id)}
                      style={{
                        background: '#2d6cdf',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      归还
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BorrowManagementPage; 