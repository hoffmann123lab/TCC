import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

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
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* Banner de Boas-Vindas */}
      <div style={{
        backgroundColor: '#1e293b',
        color: '#ffffff',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>Bem-vindo ao SheetHub! 👋</h1>
          <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.95rem' }}>
            Crie, padronize e exporte suas planilhas com facilidade.
          </p>
        </div>
        <Link 
          to="/sheet/new" 
          style={{ 
            padding: '0.75rem 1.5rem', 
            fontWeight: 'bold', 
            backgroundColor: '#2563eb', 
            color: '#ffffff', 
            borderRadius: '8px', 
            textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
          }}
        >
          + Criar Nova Planilha
        </Link>
      </div>

      {/* Cards de Estatísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ fontSize: '1.8rem', backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: '10px' }}>
              {stat.icon}
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{stat.label}</span>
              <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.75rem', color: '#0f172a', fontWeight: '700' }}>
                {loading ? '...' : stat.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Recentes e Atalhos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: '700' }}>📄 Planilhas Recentes</h3>
            <Link to="/sheets" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600' }}>Ver todas →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Carregando...</p>
            ) : recentSheets.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Nenhuma planilha criada ainda.</p>
            ) : (
              recentSheets.map((sheet, idx) => (
                <Link key={sheet._id || idx} to={`/sheet/${sheet._id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px', textDecoration: 'none', color: '#334155', transition: 'background-color 0.2s' }}>
                  <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{sheet.title || 'Sem título'}</span>
                  <span style={{ color: '#2563eb', fontWeight: 'bold' }}>→</span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 0.5rem', color: '#0f172a', fontSize: '1.2rem', fontWeight: '700' }}>✨ Atalhos Rápidos</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Acesse os modelos prontos para agilizar seu trabalho:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link 
              to="/templates" 
              style={{ 
                textAlign: 'center', 
                backgroundColor: '#f1f5f9', 
                color: '#1e293b', 
                padding: '0.75rem 1rem', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontWeight: '600',
                fontSize: '0.95rem'
              }}
            >
              📊 Ver Todos os Modelos ({templatesCount})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}