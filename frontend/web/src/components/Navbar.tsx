import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

const handleLogout = () => {
    logout();
    navigate('/login');
};

// Hide the navbar entirely if the user is on the login screen
if (!isAuthenticated) return null;

return (
    <nav style={{ padding: '1rem', backgroundColor: '#f3f4f6', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <h2 style={{ margin: '0 1rem 0 0' }}>Reading Tracker</h2>
        <Link to="/">My Dashboard</Link>
        <Link to="/books">Book Catalog</Link>
        <div style={{ flexGrow: 1 }}></div>
        <button onClick={handleLogout}>Logout</button>
    </nav>
);


};