import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
