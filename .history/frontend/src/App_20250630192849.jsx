import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserLibraryPage from './pages/UserLibraryPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import ReaderManagementPage from './pages/admin/ReaderManagementPage';
import BookManagementPage from './pages/admin/BookManagementPage';
import BorrowManagementPage from './pages/admin/BorrowManagementPage';
import AdminManagementPage from './pages/admin/AdminManagementPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="library" element={<UserLibraryPage />} />
          <Route path="admin-login" element={<AdminLoginPage />} />
          <Route path="admin" element={<AdminPage />}>
            <Route path="readers" element={<ReaderManagementPage />} />
            <Route path="books" element={<BookManagementPage />} />
            <Route path="borrowing" element={<BorrowManagementPage />} />
            <Route path="admins" element={<AdminManagementPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
