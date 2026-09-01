import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logoImg from '../assets/logo.png'; // 👈 Caminho correto para src/assets/logo.png

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
  const userName = user?.name || user?.nome || '';
  const isAdmin = ALLOWED_ADMIN_EMAILS.includes(userEmail);

  const isActive = (path) => (location.pathname === path ? 'nav-link active' : 'nav-link');

  const handleLogout = () => {
    const nameToDisplay = userName;

    localStorage.clear();

    navigate('/', {
      state: {
        loggedOut: true,
        userName: nameToDisplay
      }
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <img src={logoImg} alt="Logo SheetHub" className="navbar-logo" />
          <span>SheetHub</span>
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard" className={isActive('/dashboard')}>
             Dashboard
          </Link>

          <Link to="/templates" className={isActive('/templates')}>
             Modelos
          </Link>

          <Link to="/sheets" className={isActive('/sheets')}>
             Minhas Planilhas
          </Link>

          {isAdmin && (
            <>
              <Link to="/admin/sheets" className={isActive('/admin/sheets')}>
                 Gerenciar Planilhas
              </Link>
              <Link to="/admin/users" className={isActive('/admin/users')}>
                 Gerenciar Usuários
              </Link>
            </>
          )}

          <button onClick={handleLogout} className="btn-logout">
             Sair
          </button>
        </div>
      </div>
    </nav>
  );
}