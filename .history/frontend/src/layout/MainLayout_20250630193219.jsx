import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';

const MainLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');
    setIsLoggedIn(!!userToken);
    setIsAdmin(!!adminToken);
  }, [location]);

  const handleLogout = () => {
    if (isAdmin) {
      localStorage.removeItem('adminToken');
      setIsAdmin(false);
      navigate('/admin-login');
    } else {
      localStorage.removeItem('userToken');
      setIsLoggedIn(false);
      navigate('/login');
    }
  };

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
          {isLoggedIn ? (
            <>
              <li>
                <NavLink to="/library" className={({ isActive }) => isActive ? 'active' : ''}>我的图书馆</NavLink>
              </li>
              <li>
                <a href="#" onClick={handleLogout}>退出登录</a>
              </li>
            </>
          ) : isAdmin ? (
            <>
              <li>
                <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>管理中心</NavLink>
              </li>
              <li>
                <a href="#" onClick={handleLogout}>退出登录</a>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>用户登录</NavLink>
              </li>
              <li>
                <NavLink to="/admin-login" className={({ isActive }) => isActive ? 'active' : ''}>管理员登录</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      <hr style={{ border: 'none', margin: 0 }} />
      <main>
        <div className="background-overlay"></div>
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout; 