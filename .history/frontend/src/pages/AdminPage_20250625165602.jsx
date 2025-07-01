import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div>
      <h2>管理员功能</h2>
      <nav>
        <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', gap: '20px' }}>
          <li>
            <Link to="readers">读者管理</Link>
          </li>
          <li>
            <Link to="books">图书管理</Link>
          </li>
          <li>
            <Link to="borrowing">借还管理</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #eee' }}>
        {/* 子路由对应的组件将在这里渲染 */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage; 