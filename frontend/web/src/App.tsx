import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* The Catalog route allows anonymous access */}
            <Route path="/books" element={<Catalog />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}