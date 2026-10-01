import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import BooksPage from './Pages/BooksPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import BorrowersPage from './Pages/BorrowersPage';
import LoansPage from './Pages/LoansPage';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className={user ? 'app-shell' : ''}>
        {user && <Sidebar user={user} onLogout={handleLogout} />}

        <main className={user ? 'app-main' : ''}>
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={setUser} />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/" element={user ? <BooksPage /> : <Navigate to="/login" />} />
            <Route path="/borrowers" element={user ? <BorrowersPage /> : <Navigate to="/login" />} />
            <Route path="/loans" element={user ? <LoansPage /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;