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
  // 校验应还日期
  const borrowTime = new Date(borrow_date);
  const dueTime = new Date(due_date);
  if (dueTime < borrowTime) {
    return res.json({ success: false, message: '应还日期不能早于借书日期' });
  }
  // 查询用户类型和当前借阅数量
  db.query('SELECT reader_type FROM reader WHERE reader_id=?', [reader_id], (err, userRows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (userRows.length === 0) return res.json({ success: false, message: '用户不存在' });
    const reader_type = userRows[0].reader_type;
    const maxBorrow = reader_type === '学生' ? 2 : 3;
    const maxDays = reader_type === '学生' ? 30 : 60;
    if ((dueTime - borrowTime) / (1000 * 60 * 60 * 24) > maxDays) {
      return res.json({ success: false, message: `学生最多可借1个月，老师最多可借2个月` });
    }
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
          // 生成新的borrow_id（如B001、B002）
          db.query('SELECT borrow_id FROM borrow_return ORDER BY borrow_id DESC LIMIT 1', (err5, results2) => {
            if (err5) return res.status(500).json({ error: err5.message });
            let newBorrowId = 'B001';
            if (results2.length > 0) {
              const lastId = results2[0].borrow_id;
              const num = parseInt(lastId.substring(1)) + 1;
              newBorrowId = 'B' + num.toString().padStart(3, '0');
            }
            db.query(
              'INSERT INTO borrow_return (borrow_id, reader_id, book_id, borrow_date, due_date) VALUES (?, ?, ?, ?, ?)',
              [newBorrowId, reader_id, book_id, borrow_date, due_date],
              (err6, result) => {
                if (err6) return res.status(500).json({ error: err6.message });
                db.query('UPDATE book SET available_copies = available_copies - 1 WHERE book_id=?', [book_id]);
                // 借书成功后自动删除该用户对该书的预约记录
                db.query('DELETE FROM reservation WHERE reader_id=? AND book_id=?', [reader_id, book_id]);
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
          db.query(
            'INSERT INTO reservation (reservation_id, reader_id, book_id, reservation_date) VALUES (?, ?, ?, ?)',
            [newId, reader_id, book_id, reservation_date],
            (err5, result) => {
              if (err5) return res.status(500).json({ error: err5.message });
              // 预约成功，book表reservation_count自增
              db.query('UPDATE book SET reservation_count = reservation_count + 1 WHERE book_id=?', [book_id]);
              res.json({ success: true, message: '预约成功' });
            }
          );
        });
      });
    });
  });
});

// 7. 查询借阅历史（带书名和评分信息）
app.get('/api/history/:reader_id', (req, res) => {
  const { reader_id } = req.params;
  db.query(
    `SELECT br.*, b.title, 
     CASE WHEN brating.rating IS NOT NULL THEN 1 ELSE 0 END as has_rated
     FROM borrow_return br 
     LEFT JOIN book b ON br.book_id = b.book_id 
     LEFT JOIN book_rating brating ON br.reader_id = brating.reader_id AND br.book_id = brating.book_id
     WHERE br.reader_id=? 
     ORDER BY br.borrow_date DESC`,
    [reader_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// 获取用户对某本书的评分信息
app.get('/api/user-rating/:reader_id/:book_id', (req, res) => {
  const { reader_id, book_id } = req.params;
  db.query('SELECT rating FROM book_rating WHERE reader_id=? AND book_id=?', [reader_id, book_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      res.json({ hasRated: true, rating: results[0].rating });
    } else {
      res.json({ hasRated: false, rating: null });
    }
  });
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

// 9. 获取所有读者
app.get('/api/admin/readers', (req, res) => {
  db.query('SELECT * FROM reader ORDER BY reader_id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 10. 修改读者信息
app.put('/api/admin/readers/:reader_id', (req, res) => {
  const { reader_id } = req.params;
  const { name, gender, contact_info, reader_type, Password } = req.body;

  let fields = [];
  let params = [];

  if (name) { fields.push('name=?'); params.push(name); }
  if (gender) { fields.push('gender=?'); params.push(gender); }
  if (contact_info) { fields.push('contact_info=?'); params.push(contact_info); }
  if (reader_type) { fields.push('reader_type=?'); params.push(reader_type); }
  if (Password) { fields.push('Password=?'); params.push(Password); }

  if (fields.length === 0) {
    return res.json({ success: false, message: '无修改内容' });
  }

  params.push(reader_id);

  db.query(`UPDATE reader SET ${fields.join(', ')} WHERE reader_id=?`, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.json({ success: false, message: '未找到读者' });
    res.json({ success: true, message: '修改成功' });
  });
});

// 11. 删除读者
app.delete('/api/admin/readers/:reader_id', (req, res) => {
  const { reader_id } = req.params;
  // 安全起见，先检查该读者有无未还的书
  db.query('SELECT COUNT(*) as cnt FROM borrow_return WHERE reader_id=? AND return_date IS NULL', [reader_id], (err, cntRows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (cntRows[0].cnt > 0) {
      return res.json({ success: false, message: '该读者有未归还的书籍，不能删除' });
    }
    db.query('DELETE FROM reader WHERE reader_id=?', [reader_id], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (result.affectedRows === 0) return res.json({ success: false, message: '未找到读者' });
      res.json({ success: true, message: '删除成功' });
    });
  });
});

// 12. 添加图书
app.post('/api/admin/books', (req, res) => {
  const book = req.body;
  const fields = ['book_id', 'title', 'author', 'publisher', 'publication_date', 'total_copies', 'available_copies', 'theme_word', 'classification_num', 'call_num', 'series_title'];
  const params = fields.map(f => book[f] || null);

  db.query(`INSERT INTO book (${fields.join(',')}) VALUES (?,?,?,?,?,?,?,?,?,?,?)`, params, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.json({ success: false, message: 'ISBN已存在' });
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: '添加成功' });
  });
});

// 13. 修改图书
app.put('/api/admin/books/:book_id', (req, res) => {
  const { book_id } = req.params;
  const book = req.body;

  const fields = ['title', 'author', 'publisher', 'publication_date', 'total_copies', 'available_copies', 'theme_word', 'classification_num', 'call_num', 'series_title'];
  let updateFields = [];
  let params = [];

  fields.forEach(f => {
    if (book[f] !== undefined) {
      updateFields.push(`${f}=?`);
      params.push(book[f]);
    }
  });

  if (updateFields.length === 0) {
    return res.json({ success: false, message: '无修改内容' });
  }

  params.push(book_id);

  db.query(`UPDATE book SET ${updateFields.join(',')} WHERE book_id=?`, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.json({ success: false, message: '未找到图书' });
    res.json({ success: true, message: '修改成功' });
  });
});

// 14. 删除图书
app.delete('/api/admin/books/:book_id', (req, res) => {
  const { book_id } = req.params;
  // 安全起见，先检查该书是否被借出
  db.query('SELECT COUNT(*) as cnt FROM borrow_return WHERE book_id=? AND return_date IS NULL', [book_id], (err, cntRows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (cntRows[0].cnt > 0) {
      return res.json({ success: false, message: '该书有未归还的借阅记录，不能删除' });
    }
    db.query('DELETE FROM book WHERE book_id=?', [book_id], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (result.affectedRows === 0) return res.json({ success: false, message: '未找到图书' });
      res.json({ success: true, message: '删除成功' });
    });
  });
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

// 查询用户所有预约信息（带书名）
app.get('/api/reservations/:reader_id', (req, res) => {
  const { reader_id } = req.params;
  db.query('SELECT r.*, b.title FROM reservation r LEFT JOIN book b ON r.book_id = b.book_id WHERE r.reader_id=?', [reader_id], (err, results) => {
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

// 评分接口（使用book_rating表，避免数据库卡顿）
app.post('/api/rate', (req, res) => {
  const { reader_id, book_id, rating } = req.body;
  if (!reader_id || !book_id || !rating) {
    return res.json({ success: false, message: '信息不完整' });
  }

  // 检查用户是否已归还该书
  db.query('SELECT * FROM borrow_return WHERE reader_id=? AND book_id=? AND return_date IS NOT NULL', [reader_id, book_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.json({ success: false, message: '只能对已归还的书评分' });

    // 检查是否已评分
    db.query('SELECT * FROM book_rating WHERE reader_id=? AND book_id=?', [reader_id, book_id], (err2, ratingRows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (ratingRows.length > 0) return res.json({ success: false, message: '您已评价过该书' });

      // 插入新评分
      db.query('INSERT INTO book_rating (reader_id, book_id, rating) VALUES (?, ?, ?)', [reader_id, book_id, rating], (err3, result) => {
        if (err3) return res.status(500).json({ error: err3.message });

        // 计算该书所有评分的平均分和人数
        db.query('SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM book_rating WHERE book_id=?', [book_id], (err4, avgRows) => {
          if (err4) return res.status(500).json({ error: err4.message });

          const avgRating = avgRows[0].avg_rating || 0;
          const ratingCount = avgRows[0].count || 0;

          // 更新book表的rating_count字段（存储评分人数）
          db.query('UPDATE book SET rating_count=? WHERE book_id=?', [ratingCount, book_id], (err5) => {
            if (err5) return res.status(500).json({ error: err5.message });
            res.json({ success: true, message: '评分成功', rating: avgRating, ratingCount });
          });
        });
      });
    });
  });
});

// 首页推荐API
// 1. 热门借阅（2个月内借阅次数最多，前5名）
app.get('/api/recommend/popular-borrow', (req, res) => {
  db.query(`SELECT b.book_id, b.title, b.author, COUNT(br.borrow_id) as borrow_count
    FROM borrow_return br
    LEFT JOIN book b ON br.book_id = b.book_id
    WHERE br.borrow_date >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH)
    GROUP BY br.book_id
    ORDER BY borrow_count DESC
    LIMIT 5`, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
// 2. 热门评分（前5名，使用book_rating表计算平均分）
app.get('/api/recommend/popular-rating', (req, res) => {
  db.query(`SELECT b.book_id, b.title, b.author, 
    AVG(br.rating) as avg_rating, COUNT(br.rating) as rating_count
    FROM book b
    INNER JOIN book_rating br ON b.book_id = br.book_id
    GROUP BY b.book_id, b.title, b.author
    HAVING COUNT(br.rating) > 0
    ORDER BY avg_rating DESC, rating_count DESC
    LIMIT 5`, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
// 3. 热门收藏（预约次数最多，前5名）
app.get('/api/recommend/popular-collect', (req, res) => {
  db.query(`SELECT book_id, title, author, reservation_count FROM book ORDER BY reservation_count DESC LIMIT 5`, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
// 4. 新书通报（每类最新4本）
app.get('/api/recommend/new-books', (req, res) => {
  db.query(`SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY theme_word ORDER BY publication_date DESC) as rn
    FROM book
  ) t WHERE rn <= 4`, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    // 按theme_word分类
    const grouped = {};
    results.forEach(row => {
      if (!grouped[row.theme_word]) grouped[row.theme_word] = [];
      grouped[row.theme_word].push(row);
    });
    res.json(grouped);
  });
});

// 你可以继续添加管理员修改/删除读者、书目等API

app.listen(4001, () => {
  console.log('后端API服务已启动，端口4001');
});