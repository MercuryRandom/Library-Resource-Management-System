const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 修改为你的 TiDB 连接信息
const db = mysql.createConnection({
  host: '你的TiDB主机IP',   // 比如 192.168.1.100
  user: '你的用户名',        // 比如 root
  password: '你的密码',
  database: '你的数据库名',
  port: 4000                // TiDB 默认端口
});

// 测试数据库连接
db.connect(err => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('数据库连接成功');
  }
});

// 1. 用户注册
app.post('/api/register', (req, res) => {
  const { username, password, name, gender, contact_info, reader_type } = req.body;
  if (!username || !password || !name || !contact_info || !reader_type) {
    return res.json({ success: false, message: '信息不完整' });
  }
  db.query(
    'INSERT INTO reader (reader_id, password, name, gender, contact_info, reader_type) VALUES (?, ?, ?, ?, ?, ?)',
    [username, password, name, gender || null, contact_info, reader_type],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.json({ success: false, message: '账号已存在' });
        }
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, message: '注册成功' });
    }
  );
});

// 2. 用户登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM reader WHERE reader_id=? AND password=?', [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.json({ success: false, message: '账号或密码错误' });
    }
  });
});

// 3. 查询所有书籍
app.get('/api/books', (req, res) => {
  db.query('SELECT * FROM book', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 4. 借书
app.post('/api/borrow', (req, res) => {
  const { reader_id, book_id, borrow_date, due_date } = req.body;
  if (!reader_id || !book_id || !borrow_date || !due_date) {
    return res.json({ success: false, message: '信息不完整' });
  }
  db.query('SELECT available_copies FROM book WHERE book_id=?', [book_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0 || results[0].available_copies <= 0) {
      return res.json({ success: false, message: '该书无可借阅库存' });
    }
    db.query(
      'INSERT INTO borrow_return (borrow_id, reader_id, book_id, borrow_date, due_date) VALUES (UUID(), ?, ?, ?, ?)',
      [reader_id, book_id, borrow_date, due_date],
      (err2, result) => {
        if (err2) return res.status(500).json({ error: err2.message });
        db.query('UPDATE book SET available_copies = available_copies - 1 WHERE book_id=?', [book_id]);
        res.json({ success: true, message: '借书成功' });
      }
    );
  });
});

// 5. 还书
app.post('/api/return', (req, res) => {
  const { borrow_id, return_date } = req.body;
  if (!borrow_id || !return_date) {
    return res.json({ success: false, message: '信息不完整' });
  }
  db.query(
    'UPDATE borrow_return SET return_date=? WHERE borrow_id=?',
    [return_date, borrow_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.json({ success: false, message: '未找到借书记录' });
      db.query(
        'UPDATE book SET available_copies = available_copies + 1 WHERE book_id = (SELECT book_id FROM borrow_return WHERE borrow_id=?)',
        [borrow_id]
      );
      res.json({ success: true, message: '还书成功' });
    }
  );
});

// 6. 预约借书
app.post('/api/reserve', (req, res) => {
  const { reader_id, book_id, reservation_date } = req.body;
  if (!reader_id || !book_id || !reservation_date) {
    return res.json({ success: false, message: '信息不完整' });
  }
  db.query(
    'INSERT INTO reservation (reservation_id, reader_id, book_id, reservation_date) VALUES (UUID(), ?, ?, ?)',
    [reader_id, book_id, reservation_date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: '预约成功' });
    }
  );
});

// 7. 查询借阅历史
app.get('/api/history/:reader_id', (req, res) => {
  const { reader_id } = req.params;
  db.query(
    'SELECT * FROM borrow_return WHERE reader_id=? ORDER BY borrow_date DESC',
    [reader_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// 8. 管理员添加读者
app.post('/api/admin/add-reader', (req, res) => {
  const { reader_id, password, name, gender, contact_info, reader_type } = req.body;
  db.query(
    'INSERT INTO reader (reader_id, password, name, gender, contact_info, reader_type) VALUES (?, ?, ?, ?, ?, ?)',
    [reader_id, password, name, gender || null, contact_info, reader_type],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: '添加成功' });
    }
  );
});

// 你可以继续添加管理员修改/删除读者、书目等API

app.listen(3001, () => {
  console.log('后端API服务已启动，端口3001');
});