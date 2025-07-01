import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link to="/search">书目检索</Link>
          </li>
          <li>
            <Link to="/login">登录</Link>
          </li>
          <li>
            <Link to="/admin">管理员</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout; 