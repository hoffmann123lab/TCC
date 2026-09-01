import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const [sheetsCount, setSheetsCount] = useState(0);
  const [templatesCount] = useState(8);
  const [downloadsCount, setDownloadsCount] = useState(0);
  const [recentSheets, setRecentSheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const storedUser = localStorage.getItem('user');
        const loggedUser = storedUser ? JSON.parse(storedUser) : null;
        const userId = loggedUser?._id || loggedUser?.id;

        if (userId) {
          const response = await fetch(`http://localhost:5000/api/sheets?userId=${userId}`);
          if (response.ok) {
            const sheets = await response.json();
            setSheetsCount(sheets.length);
            setRecentSheets(sheets.slice(0, 3));
          }
        }

        const savedDownloads = parseInt(localStorage.getItem('sheet_downloads_count') || '0', 10);
        setDownloadsCount(savedDownloads);
      } catch (error) {
        console.error('Erro ao carregar dados do Dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const stats = [
    { label: 'Planilhas Criadas', value: sheetsCount, icon: '📁' },
    { label: 'Modelos Disponíveis', value: templatesCount, icon: '✨' },
    { label: 'Downloads Feitos', value: downloadsCount, icon: '📥' },
  ];

  return (
    <div className="dashboard-container">
      
      {/* Banner de Boas-Vindas */}
      <div className="welcome-banner">
        <div>
          <h1 className="welcome-title">Bem-vindo ao SheetHub! </h1>
          <p className="welcome-subtitle">
            Crie, padronize e exporte suas planilhas com facilidade.
          </p>
        </div>
        <Link to="/sheet/new" className="btn-primary">
          + Criar Nova Planilha
        </Link>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              {stat.icon}
            </div>
            <div>
              <span className="stat-label">{stat.label}</span>
              <h2 className="stat-value">
                {loading ? '...' : stat.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Recentes e Atalhos */}
      <div className="sections-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title"> Planilhas Recentes</h3>
            <Link to="/sheets" className="card-link">Ver todas →</Link>
          </div>
          <div className="items-list">
            {loading ? (
              <p className="loading-text">Carregando...</p>
            ) : recentSheets.length === 0 ? (
              <p className="empty-text">Nenhuma planilha criada ainda.</p>
            ) : (
              recentSheets.map((sheet, idx) => (
                <Link key={sheet._id || idx} to={`/sheet/${sheet._id}`} className="sheet-item">
                  <span className="sheet-item-title">{sheet.title || 'Sem título'}</span>
                  <span className="sheet-item-arrow">→</span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title-with-subtitle"> Atalhos Rápidos</h3>
          <p className="card-subtitle">Acesse os modelos prontos para agilizar seu trabalho:</p>
          <div className="items-list">
            <Link to="/templates" className="btn-secondary">
               Ver Todos os Modelos ({templatesCount})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}