import React, { useState, useEffect } from 'react';

// ReaderForm component for Add/Edit
const ReaderForm = ({ reader, onSave, onCancel, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    Password: '',
    gender: '男',
    contact_info: '',
    reader_type: '学生',
    ...reader
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
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 10, padding: 32, minWidth: 360, boxShadow: '0 4px 24px #0002' }}>
        <h3 style={{ marginTop: 0 }}>{reader ? '修改读者' : '添加读者'}</h3>
        {!reader && (
          <div style={{ marginBottom: 10 }}>
            <label>读者ID (reader_id)</label>
            <input name="reader_id" value={formData.reader_id || ''} onChange={handleChange} placeholder="如R001" required />
          </div>
        )}
        <div style={{ marginBottom: 10 }}>
          <label>姓名 (name)</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>密码 (Password)</label>
          <input name="Password" value={formData.Password} onChange={handleChange} placeholder={reader ? "留空则不修改" : ""} required={!reader} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>联系方式 (contact_info)</label>
          <input name="contact_info" value={formData.contact_info} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>类型 (reader_type)</label>
          <select name="reader_type" value={formData.reader_type} onChange={handleChange}>
            <option value="学生">学生</option>
            <option value="教职工">教职工</option>
          </select>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>性别 (gender)</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="男">男</option>
            <option value="女">女</option>
            <option value="其他">其他</option>
          </select>
        </div>
        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
          <button type="button" onClick={onCancel}>取消</button>
          <button type="submit">保存</button>
        </div>
      </form>
    </div>
  );
};

const ReaderManagementPage = () => {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({ open: false, reader: null, error: '' });

  const fetchReaders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4001/api/admin/readers');
      const data = await res.json();
      setReaders(data);
    } catch {
      setError('获取读者列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReaders();
  }, []);

  const handleSave = async (formData) => {
    const isEdit = !!formState.reader;
    const url = isEdit ? `http://localhost:4001/api/admin/readers/${formState.reader.reader_id}` : 'http://localhost:4001/api/admin/add-reader';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setFormState({ open: false, reader: null, error: '' });
        fetchReaders();
      } else {
        setFormState({ ...formState, error: data.message || '保存失败' });
      }
    } catch {
      setFormState({ ...formState, error: '请求失败' });
    }
  };

  const handleDelete = async (reader_id) => {
    if (window.confirm(`确认删除读者 ${reader_id} 吗？`)) {
      try {
        const res = await fetch(`http://localhost:4001/api/admin/readers/${reader_id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchReaders();
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
      <h3>读者管理</h3>
      <button onClick={() => setFormState({ open: true, reader: null, error: '' })}>添加读者</button>
      {loading ? <div>加载中...</div> : error ? <div>{error}</div> : (
        <table style={{ width: '100%', marginTop: 10 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>姓名</th>
              <th>性别</th>
              <th>联系方式</th>
              <th>类型</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {readers.map(r => (
              <tr key={r.reader_id}>
                <td>{r.reader_id}</td>
                <td>{r.name}</td>
                <td>{r.gender}</td>
                <td>{r.contact_info}</td>
                <td>{r.reader_type}</td>
                <td>
                  <button onClick={() => setFormState({ open: true, reader: r, error: '' })}>修改</button>
                  <button onClick={() => handleDelete(r.reader_id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {formState.open && <ReaderForm reader={formState.reader} onSave={handleSave} onCancel={() => setFormState({ open: false, reader: null, error: '' })} error={formState.error} />}
    </div>
  );
};

export default ReaderManagementPage; 