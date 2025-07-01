import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ReaderManagementPage from './pages/admin/ReaderManagementPage';
import BookManagementPage from './pages/admin/BookManagementPage';
import BorrowManagementPage from './pages/admin/BorrowManagementPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="admin" element={<AdminPage />}>
            <Route path="readers" element={<ReaderManagementPage />} />
            <Route path="books" element={<BookManagementPage />} />
            <Route path="borrowing" element={<BorrowManagementPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
