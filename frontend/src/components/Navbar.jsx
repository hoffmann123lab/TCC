import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const ALLOWED_ADMIN_EMAILS = [
  'rafaelhoffmann@gmail.com',
  'samuelcunha@gmail.com'
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const storedData = localStorage.getItem('user_data') || localStorage.getItem('user');
  const parsedData = storedData ? JSON.parse(storedData) : {};
  const user = parsedData.user || parsedData;

  const userEmail = user?.email ? user.email.toLowerCase().trim() : '';
  const isAdmin = ALLOWED_ADMIN_EMAILS.includes(userEmail);

  const isActive = (path) => (location.pathname === path ? 'nav-link active' : 'nav-link');

  const handleLogout = () => {
    alert(`Você saiu da conta.`);
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span>SheetHub</span>
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard" className={isActive('/dashboard')}>
            🏠 Dashboard
          </Link>

          <Link to="/templates" className={isActive('/templates')}>
            ✨ Modelos
          </Link>

          <Link to="/sheets" className={isActive('/sheets')}>
            📁 Minhas Planilhas
          </Link>

          {/* Renderizado apenas para Rafael e Samuel */}
          {isAdmin && (
            <Link to="/admin/sheets" className={isActive('/admin/sheets')}>
              ⚙️ Gerenciar Planilhas
            </Link>
          )}

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginLeft: '1rem',
              fontSize: '0.85rem'
            }}
          >
            🚪 Sair
          </button>
        </div>
      </div>
    </nav>
  );
}