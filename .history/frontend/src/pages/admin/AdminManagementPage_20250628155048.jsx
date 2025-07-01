import React, { useState, useEffect } from 'react';

// AdminForm component for Add/Edit
const AdminForm = ({ admin, onSave, onCancel, error }) => {
  const [formData, setFormData] = useState({
    admin_id: '',
    Password: '',
    admin_type: '普通管理员',
    ...admin
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
        <h3 style={{ marginTop: 0 }}>{admin ? '修改管理员' : '添加管理员'}</h3>
        {!admin && (
          <div style={{ marginBottom: 10 }}>
            <label>管理员ID (admin_id)</label>
            <input name="admin_id" value={formData.admin_id || ''} onChange={handleChange} placeholder="如A001" required />
          </div>
        )}
        <div style={{ marginBottom: 10 }}>
          <label>密码 (Password)</label>
          <input name="Password" type="password" value={formData.Password} onChange={handleChange} placeholder={admin ? "留空则不修改" : ""} required={!admin} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>管理员类型 (admin_type)</label>
          <select name="admin_type" value={formData.admin_type} onChange={handleChange}>
            <option value="普通管理员">普通管理员</option>
            <option value="高级管理员">高级管理员</option>
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

const AdminManagementPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({ open: false, admin: null, error: '' });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4001/api/admin/admins');
      const data = await res.json();
      setAdmins(data);
    } catch {
      setError('获取管理员列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSave = async (formData) => {
    const isEdit = !!formState.admin;
    const url = isEdit ? `http://localhost:4001/api/admin/admins/${formState.admin.admin_id}` : 'http://localhost:4001/api/admin/add-admin';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setFormState({ open: false, admin: null, error: '' });
        fetchAdmins();
      } else {
        setFormState({ ...formState, error: data.message || '保存失败' });
      }
    } catch {
      setFormState({ ...formState, error: '请求失败' });
    }
  };

  const handleDelete = async (admin_id) => {
    if (window.confirm(`确认删除管理员 ${admin_id} 吗？`)) {
      try {
        const res = await fetch(`http://localhost:4001/api/admin/admins/${admin_id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchAdmins();
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
      <h3>管理员管理</h3>
      <button onClick={() => setFormState({ open: true, admin: null, error: '' })}>添加管理员</button>
      {loading ? <div>加载中...</div> : error ? <div>{error}</div> : (
        <table style={{ width: '100%', marginTop: 10 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>类型</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.admin_id}>
                <td>{a.admin_id}</td>
                <td>{a.admin_type}</td>
                <td>{a.created_at ? new Date(a.created_at).toLocaleString() : '-'}</td>
                <td>
                  <button onClick={() => setFormState({ open: true, admin: a, error: '' })}>修改</button>
                  <button onClick={() => handleDelete(a.admin_id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {formState.open && <AdminForm admin={formState.admin} onSave={handleSave} onCancel={() => setFormState({ open: false, admin: null, error: '' })} error={formState.error} />}
    </div>
  );
};

export default AdminManagementPage; 