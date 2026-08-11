import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          📊 <span>SheetMaker</span>
        </Link>
        <div className="navbar-links">
          <Link to="/">Dashboard</Link>
          <Link to="/login">Sair</Link>
        </div>
      </div>
    </nav>
  );
}