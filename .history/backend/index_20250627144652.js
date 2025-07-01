const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 修改为你的 TiDB 连接信息
const db = mysql.createConnection({
  host: '192.168.47.200',   // 比如 192.168.1.100
  user: 'hg',        // 比如 root
  password: '765765',
  database: 'library_system',
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
  const { password, name, gender, contact_info, reader_type } = req.body;
  if (!password || !name || !contact_info || !reader_type) {
    return res.json({ success: false, message: '信息不完整' });
  }

  // 先检查手机号是否已存在
  db.query('SELECT reader_id FROM reader WHERE contact_info = ?', [contact_info], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (results.length > 0) {
      return res.json({ success: false, message: '该手机号已被注册' });
    }

    // 查询当前最大的reader_id，生成新的ID
    db.query('SELECT reader_id FROM reader ORDER BY reader_id DESC LIMIT 1', (err2, results2) => {
      if (err2) return res.status(500).json({ success: false, error: err2.message });

      let newReaderId = 'R001';
      if (results2.length > 0) {
        const lastId = results2[0].reader_id;
        const num = parseInt(lastId.substring(1)) + 1;
        newReaderId = 'R' + num.toString().padStart(3, '0');
      }

      // 插入新用户
      db.query(
        'INSERT INTO reader (reader_id, Password, name, gender, contact_info, reader_type) VALUES (?, ?, ?, ?, ?, ?)',
        [newReaderId, password, name, gender || null, contact_info, reader_type],
        (err3, result) => {
          if (err3) {
            return res.status(500).json({ success: false, error: err3.message });
          }
          res.json({ success: true, message: '注册成功', reader_id: newReaderId });
        }
      );
    });
  });
});

// 2. 用户登录（手机号+密码）
app.post('/api/login', (req, res) => {
  const { contact_info, password } = req.body;
  db.query('SELECT * FROM reader WHERE contact_info=? AND Password=?', [contact_info, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.json({ success: false, message: '手机号或密码错误' });
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
  // 查询用户类型和当前借阅数量
  db.query('SELECT reader_type FROM reader WHERE reader_id=?', [reader_id], (err, userRows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (userRows.length === 0) return res.json({ success: false, message: '用户不存在' });
    const reader_type = userRows[0].reader_type;
    const maxBorrow = reader_type === '学生' ? 2 : 3;
    db.query('SELECT COUNT(*) as cnt FROM borrow_return WHERE reader_id=? AND return_date IS NULL', [reader_id], (err2, cntRows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (cntRows[0].cnt >= maxBorrow) {
        return res.json({ success: false, message: `您的借阅数量已达上限（${maxBorrow}本）` });
      }
      // 查询当前预约信息
      db.query('SELECT book_id FROM reservation WHERE reader_id=?', [reader_id], (err3, reserveRows) => {
        if (err3) return res.status(500).json({ error: err3.message });
        // 检查库存
        db.query('SELECT available_copies FROM book WHERE book_id=?', [book_id], (err4, results) => {
          if (err4) return res.status(500).json({ error: err4.message });
          if (results.length === 0 || results[0].available_copies <= 0) {
            return res.json({ success: false, message: '该书无可借阅库存' });
          }
          db.query(
            'INSERT INTO borrow_return (borrow_id, reader_id, book_id, borrow_date, due_date) VALUES (UUID(), ?, ?, ?, ?)',
            [reader_id, book_id, borrow_date, due_date],
            (err5, result) => {
              if (err5) return res.status(500).json({ error: err5.message });
              db.query('UPDATE book SET available_copies = available_copies - 1 WHERE book_id=?', [book_id]);
              // 返回预约提示
              let reserveMsg = '';
              if (reserveRows.length > 0) {
                reserveMsg = '您已预约过以下书籍：' + reserveRows.map(r => r.book_id).join(', ');
              }
              res.json({ success: true, message: '借书成功', reserveMsg });
            }
          );
        });
      });
    });
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
  // 查询用户类型和当前预约数量
  db.query('SELECT reader_type FROM reader WHERE reader_id=?', [reader_id], (err, userRows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (userRows.length === 0) return res.json({ success: false, message: '用户不存在' });
    const reader_type = userRows[0].reader_type;
    const maxReserve = reader_type === '学生' ? 2 : 3;
    db.query('SELECT COUNT(*) as cnt FROM reservation WHERE reader_id=?', [reader_id], (err2, cntRows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (cntRows[0].cnt >= maxReserve) {
        return res.json({ success: false, message: `您的预约数量已达上限（${maxReserve}本）` });
      }
      // 检查是否已预约同一本书
      db.query('SELECT * FROM reservation WHERE reader_id=? AND book_id=?', [reader_id, book_id], (err3, existRows) => {
        if (err3) return res.status(500).json({ error: err3.message });
        if (existRows.length > 0) {
          return res.json({ success: false, message: '您已预约过该书' });
        }
        // 生成新的reservation_id（如Y001、Y002）
        db.query('SELECT reservation_id FROM reservation ORDER BY reservation_id DESC LIMIT 1', (err4, results) => {
          if (err4) return res.status(500).json({ error: err4.message });
          let newId = 'Y001';
          if (results.length > 0) {
            const lastId = results[0].reservation_id;
            const num = parseInt(lastId.substring(1)) + 1;
            newId = 'Y' + num.toString().padStart(3, '0');
          }
          // 插入预约
          db.query(
            'INSERT INTO reservation (reservation_id, reader_id, book_id, reservation_date) VALUES (?, ?, ?, ?)',
            [newId, reader_id, book_id, reservation_date],
            (err5, result) => {
              if (err5) return res.status(500).json({ error: err5.message });
              res.json({ success: true, message: '预约成功，预约时间为两天', reservation_id: newId });
            }
          );
        });
      });
    });
  });
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
    'INSERT INTO reader (reader_id, Password, name, gender, contact_info, reader_type) VALUES (?, ?, ?, ?, ?, ?)',
    [reader_id, password, name, gender || null, contact_info, reader_type],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: '添加成功' });
    }
  );
});

// 管理员登录
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM administrator WHERE username=? AND password=?', [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      res.json({ success: true, admin: results[0] });
    } else {
      res.json({ success: false, message: '用户名或密码错误' });
    }
  });
});

// 馆藏检索（多字段模糊检索、排序、分页）
app.post('/api/books/search', (req, res) => {
  const {
    keyword = '',
    fields = [
      'title', 'author', 'theme_word', 'book_id', 'classification_num', 'call_num', 'publisher', 'series_title'
    ],
    sortBy = 'publication_date',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10
  } = req.body;

  // 构造 where 条件
  let where = '';
  let params = [];
  if (keyword && fields.length > 0) {
    where = 'WHERE ' + fields.map(f => `${f} LIKE ?`).join(' OR ');
    params = fields.map(() => `%${keyword}%`);
  }

  // 排序字段白名单
  const sortFields = ['title', 'author', 'theme_word', 'book_id', 'classification_num', 'call_num', 'publisher', 'series_title', 'publication_date'];
  const orderBy = sortFields.includes(sortBy) ? sortBy : 'publication_date';
  const order = sortOrder === 'asc' ? 'ASC' : 'DESC';

  // 分页
  const offset = (page - 1) * pageSize;

  // 查询总数
  const countSql = `SELECT COUNT(*) as total FROM book ${where}`;
  db.query(countSql, params, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = countResult[0].total;
    // 查询数据
    const sql = `SELECT * FROM book ${where} ORDER BY ${orderBy} ${order} LIMIT ? OFFSET ?`;
    db.query(sql, [...params, Number(pageSize), Number(offset)], (err2, results) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ total, results });
    });
  });
});

// 简单检索（单字段模糊检索、排序、分页）
app.post('/api/books/simple-search', (req, res) => {
  const {
    field = 'title',
    keyword = '',
    sortBy = 'publication_date',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10
  } = req.body;

  const sortFields = ['title', 'author', 'theme_word', 'book_id', 'classification_num', 'call_num', 'publisher', 'series_title', 'publication_date'];
  const orderBy = sortFields.includes(sortBy) ? sortBy : 'publication_date';
  const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
  const offset = (page - 1) * pageSize;

  const where = keyword ? `WHERE ${field} LIKE ?` : '';
  const params = keyword ? [`%${keyword}%`] : [];

  const countSql = `SELECT COUNT(*) as total FROM book ${where}`;
  db.query(countSql, params, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = countResult[0].total;
    const sql = `SELECT * FROM book ${where} ORDER BY ${orderBy} ${order} LIMIT ? OFFSET ?`;
    db.query(sql, [...params, Number(pageSize), Number(offset)], (err2, results) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ total, results });
    });
  });
});

// 多字段检索（多个字段组合查询、排序、分页）
app.post('/api/books/advanced-search', (req, res) => {
  const {
    conditions = {}, // { title: '红楼梦', author: '曹雪芹', ... }
    sortBy = 'publication_date',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10
  } = req.body;

  const sortFields = ['title', 'author', 'theme_word', 'book_id', 'classification_num', 'call_num', 'publisher', 'series_title', 'publication_date'];
  const orderBy = sortFields.includes(sortBy) ? sortBy : 'publication_date';
  const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
  const offset = (page - 1) * pageSize;

  const whereArr = [];
  const params = [];
  Object.entries(conditions).forEach(([field, value]) => {
    if (value) {
      whereArr.push(`${field} LIKE ?`);
      params.push(`%${value}%`);
    }
  });
  const where = whereArr.length ? 'WHERE ' + whereArr.join(' AND ') : '';

  const countSql = `SELECT COUNT(*) as total FROM book ${where}`;
  db.query(countSql, params, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = countResult[0].total;
    const sql = `SELECT * FROM book ${where} ORDER BY ${orderBy} ${order} LIMIT ? OFFSET ?`;
    db.query(sql, [...params, Number(pageSize), Number(offset)], (err2, results) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ total, results });
    });
  });
});

// 查询用户所有预约信息
app.get('/api/reservations/:reader_id', (req, res) => {
  const { reader_id } = req.params;
  db.query('SELECT * FROM reservation WHERE reader_id=?', [reader_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 取消预约
app.post('/api/cancel-reservation', (req, res) => {
  const { reservation_id } = req.body;
  if (!reservation_id) return res.json({ success: false, message: '缺少预约ID' });
  db.query('DELETE FROM reservation WHERE reservation_id=?', [reservation_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.json({ success: false, message: '未找到该预约' });
    res.json({ success: true, message: '取消预约成功' });
  });
});

// 你可以继续添加管理员修改/删除读者、书目等API

app.listen(4001, () => {
  console.log('后端API服务已启动，端口4001');
});