import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export default function MySheets() {
  const [userSheets, setUserSheets] = useState([]);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sheets');
        if (response.ok) {
          const data = await response.json();
          setUserSheets(data);
        }
      } catch (error) {
        console.log('Backend indisponível no momento.', error);
      }
    };

    fetchSheets();
  }, []);

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h2>📁 Minhas Planilhas ({userSheets.length})</h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Todas as suas planilhas criadas e salvas.
      </p>

      {userSheets.length === 0 ? (
        <div className="empty-box" style={{ textAlign: 'center', padding: '3rem', border: '2px dashed #cbd5e1', borderRadius: '8px' }}>
          <p>Nenhuma planilha finalizada ainda.</p>
          <small>Crie uma nova planilha para vê-la listada aqui.</small>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/sheet/nova" className="btn btn-primary">
              + Criar Planilha
            </Link>
          </div>
        </div>
      ) : (
        <div className="my-sheets-list" style={{ display: 'grid', gap: '1rem' }}>
          {userSheets.map((sheet, index) => (
            <div key={sheet.id || index} className="saved-sheet-card" style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="saved-sheet-info">
                <h4>📊 {sheet.title || 'Planilha Sem Título'}</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{sheet.fileName || 'Planilha.xlsx'}</p>
              </div>
              <Link to={`/sheet/${sheet.id}`} className="btn btn-secondary btn-sm">
                Abrir
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}