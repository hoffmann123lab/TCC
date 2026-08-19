import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MySheets() {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [userName, setUserName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMySheets() {
      try {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        const userId = loggedUser?._id || loggedUser?.id;
        
        if (loggedUser?.name) {
          setUserName(loggedUser.name);
        }

        if (!userId) {
          console.warn('Nenhum usuário logado encontrado no localStorage.');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/sheets?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setSheets(data);
        } else {
          console.error('Falha na resposta do servidor:', response.status);
        }
      } catch (error) {
        console.error('Erro de conexão ao buscar planilhas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMySheets();
  }, []);

  const renderCellContent = (cell) => {
    if (cell === null || cell === undefined) return '-';
    if (typeof cell === 'object') {
      return cell.value !== undefined ? String(cell.value) : JSON.stringify(cell);
    }
    return String(cell);
  };

  const renderColumnHeader = (col) => {
    if (typeof col === 'object' && col !== null) {
      return col.name || col.title || col.header || JSON.stringify(col);
    }
    return String(col);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* CABEÇALHO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem' }}>📊 Minhas Planilhas</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            {userName ? `Olá, ${userName}! ` : ''}Gerencie e visualize suas planilhas criadas no SheetHub.
          </p>
        </div>

        {sheets.length > 0 && (
          <button
            onClick={() => navigate('/create-sheet')}
            style={{
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '0.65rem 1.2rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
            }}
          >
            ➕ Nova Planilha
          </button>
        )}
      </div>

      {/* ESTADO DE CARREGAMENTO */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
          <p style={{ fontSize: '1.1rem' }}>⌛ A carregar suas planilhas...</p>
        </div>
      ) : sheets.length === 0 ? (
        /* ESTADO VAZIO */
        <div
          style={{
            textAlign: 'center',
            padding: '3.5rem 2rem',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '2px dashed #cbd5e1',
            marginTop: '1rem'
          }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📄</div>
          <h2 style={{ color: '#1e293b', margin: '0 0 0.5rem 0' }}>Você ainda não possui planilhas</h2>
          <p style={{ color: '#64748b', maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: '1.5' }}>
            Crie sua primeira planilha para começar a organizar dados, colunas e registros de forma simples e rápida.
          </p>
          <button
            onClick={() => navigate('/create-sheet')}
            style={{
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(37,99,235,0.2)'
            }}
          >
            🚀 Criar Minha Primeira Planilha
          </button>
        </div>
      ) : (
        /* LISTAGEM DOS CARDS */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {sheets.map((sheet) => (
            <div
              key={sheet._id}
              style={{
                backgroundColor: '#fff',
                padding: '1.5rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>📊</span>
                  <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem', wordBreak: 'break-word' }}>
                    {sheet.title}
                  </h3>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1rem 0', minHeight: '2.5em' }}>
                  {sheet.description || 'Sem descrição cadastrada.'}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {sheet.columns?.length || 0} Colunas
                  </span>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {sheet.rows?.length || 0} Linhas
                  </span>
                </div>

                <button
                  onClick={() => setSelectedSheet(sheet)}
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    border: 'none',
                    padding: '0.6rem',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  👁️ Abrir Planilha
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL PARA VISUALIZAR A PLANILHA */}
      {selectedSheet && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '900px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, color: '#0f172a' }}>📌 {selectedSheet.title}</h2>
                {selectedSheet.description && <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>{selectedSheet.description}</p>}
              </div>
              <button onClick={() => setSelectedSheet(null)} style={{ backgroundColor: '#cbd5e1', color: '#334155', border: 'none', padding: '0.5rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                ✕ Fechar
              </button>
            </div>

            {(!selectedSheet.columns || selectedSheet.columns.length === 0) && (!selectedSheet.rows || selectedSheet.rows.length === 0) ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>Esta planilha não possui colunas ou dados cadastrados.</p>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      {selectedSheet.columns?.map((col, index) => (
                        <th key={index} style={{ padding: '0.75rem 1rem', fontWeight: 'bold', color: '#334155', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                          {renderColumnHeader(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSheet.rows?.map((row, rowIndex) => (
                      <tr key={rowIndex} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        {Array.isArray(row) ? (
                          row.map((cell, cellIndex) => (
                            <td key={cellIndex} style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.9rem' }}>
                              {renderCellContent(cell)}
                            </td>
                          ))
                        ) : typeof row === 'object' && row !== null ? (
                          Object.values(row).map((cell, cellIndex) => (
                            <td key={cellIndex} style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.9rem' }}>
                              {renderCellContent(cell)}
                            </td>
                          ))
                        ) : (
                          <td style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.9rem' }}>{renderCellContent(row)}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}