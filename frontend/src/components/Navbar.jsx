import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔍 Pega os dados do usuário do localStorage
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const isAdmin = userData.role === 'admin';

  const isActive = (path) => (location.pathname === path ? 'nav-link active' : 'nav-link');

  // 🚪 Função de Logout com Aviso
  const handleLogout = () => {
    // 1. Pega o nome do usuário logado (ou usa um texto padrão se não encontrar)
    const userName = userData.name || 'Usuário';

    // 2. Exibe o aviso
    alert(`Você saiu da conta: ${userName}`);

    // 3. Limpa a sessão do localStorage
    localStorage.removeItem('user_authenticated');
    localStorage.removeItem('user_data');

    // 4. Redireciona para a página de Login
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo apontando para o Dashboard */}
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

          {/* ITEM EXCLUSIVO DO ADMIN */}
          {isAdmin && (
            <Link to="/admin/sheets" className={isActive('/admin/sheets')}>
              ⚙️ Gerenciar Planilhas
            </Link>
          )}

          {/* BOTÃO DE SAIR */}
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