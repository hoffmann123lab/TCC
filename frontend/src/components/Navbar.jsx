import { Link, useLocation } from 'react-router-dom';
import '../App.css';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? 'nav-link active' : 'nav-link');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          {/* Tag <img> removida aqui */}
          <span>SheetHub</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={isActive('/')}>
            🏠 Dashboard
          </Link>

          <Link to="/templates" className={isActive('/templates')}>
            ✨ Modelos
          </Link>

          <Link to="/sheets" className={isActive('/sheets')}>
            📁 Minhas Planilhas
          </Link>
        </div>
      </div>
    </nav>
  );
}