import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>首页</NavLink>
          </li>
          <li>
            <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>书目检索</NavLink>
          </li>
          <li>
            <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>用户登录</NavLink>
          </li>
          <li>
            <NavLink to="/admin-login" className={({ isActive }) => isActive ? 'active' : ''}>管理员登录</NavLink>
          </li>
        </ul>
      </nav>
      <hr style={{ border: 'none', margin: 0 }} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout; 