import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MySheets() {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [userName, setUserName] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [sheetToDelete, setSheetToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMySheets() {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('user_data') || localStorage.getItem('user');
        const loggedUser = storedUser ? JSON.parse(storedUser) : null;
        const userId = loggedUser?._id || loggedUser?.id;

        if (loggedUser?.name) {
          setUserName(loggedUser.name);
        }

        if (!userId) {
          setSheets([]);
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/sheets?userId=${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setSheets(Array.isArray(data) ? data : []);
        } else {
          setSheets([]);
        }
      } catch (error) {
        console.error('Erro ao buscar planilhas:', error);
        setSheets([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMySheets();
  }, []);

  const confirmDeleteSheet = async () => {
    if (!sheetToDelete) return;

    const { id: sheetId } = sheetToDelete;
    setErrorMessage('');

    try {
      const response = await fetch(`http://localhost:5000/api/sheets/${sheetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSheets((prevSheets) => prevSheets.filter((sheet) => (sheet._id || sheet.id) !== sheetId));
        if (selectedSheet && (selectedSheet._id || selectedSheet.id) === sheetId) {
          setSelectedSheet(null);
        }
      } else {
        setErrorMessage('Erro ao excluir a planilha no servidor.');
      }
    } catch (error) {
      setErrorMessage('Erro de conexão ao excluir a planilha.');
    } finally {
      setSheetToDelete(null);
    }
  };

  const handleEditSheet = (sheetId) => {
    navigate(`/sheet/${sheetId}`);
  };

  const renderCellData = (cell) => {
    if (cell === null || cell === undefined) return { value: '-', comment: '' };

    if (typeof cell === 'object') {
      const val = cell.value !== undefined ? String(cell.value) : JSON.stringify(cell);
      const comm = cell.comment ? String(cell.comment) : '';
      return { value: val || '-', comment: comm };
    }

    return { value: String(cell), comment: '' };
  };

  const renderColumnHeader = (col) => {
    if (typeof col === 'object' && col !== null) {
      return col.name || col.title || col.header || JSON.stringify(col);
    }
    return String(col);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {errorMessage && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠️ {errorMessage}</span>
          <button onClick={() => setErrorMessage('')} style={{ background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem' }}>📊 Gerenciar Planilhas</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            {userName ? `Olá, ${userName}! ` : ''}Painel de revisão de planilhas.
          </p>
        </div>

        {sheets.length > 0 && (
          <button onClick={() => navigate('/create-sheet')} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.65rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            ➕ Nova Planilha
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
          <p style={{ fontSize: '1.1rem' }}>⌛ A carregar planilhas...</p>
        </div>
      ) : sheets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 2rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📄</div>
          <h2 style={{ color: '#1e293b', margin: '0 0 0.5rem 0' }}>Nenhuma planilha encontrada</h2>
          <button onClick={() => navigate('/create-sheet')} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            🚀 Criar Primeira Planilha
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {sheets.map((sheet) => {
            const currentId = sheet._id || sheet.id;

            return (
              <div
                key={currentId}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📊</span>
                    <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem', wordBreak: 'break-word' }}>
                      {sheet.title || 'Planilha Sem Título'}
                    </h3>
                  </div>

                  {/* 📝 OBSERVAÇÕES E EXPLICAÇÕES DO AUTOR */}
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '6px',
                    borderLeft: '3px solid #2563eb',
                    marginBottom: '1rem',
                    minHeight: '2.8em'
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                      📝 Explicação do Autor:
                    </span>
                    <p style={{ color: '#334155', fontSize: '0.85rem', margin: 0, fontStyle: sheet.description ? 'normal' : 'italic' }}>
                      {sheet.description || 'Sem observações prestadas.'}
                    </p>
                  </div>
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

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setSelectedSheet(sheet)} style={{ flex: 1, backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '0.55rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>
                      👁️ Ver
                    </button>
                    <button onClick={() => handleEditSheet(currentId)} style={{ flex: 1, backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.55rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>
                      ✏️ Editar
                    </button>
                    <button onClick={() => setSheetToDelete({ id: currentId, title: sheet.title })} style={{ backgroundColor: '#fecdd3', color: '#9f1239', border: '1px solid #fda4af', padding: '0.55rem 0.75rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Exclusão */}
      {sheetToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', padding: '1.5rem 2rem', borderRadius: '12px', width: '100%', maxWidth: '420px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>⚠️ Confirmar Exclusão</h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>
              Deseja excluir a planilha <strong>"{sheetToDelete.title}"</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setSheetToDelete(null)} style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '0.55rem 1rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={confirmDeleteSheet} style={{ backgroundColor: '#e11d48', color: '#fff', border: 'none', padding: '0.55rem 1rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização */}
      {selectedSheet && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '900px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, color: '#0f172a' }}>📌 {selectedSheet.title}</h2>
                {selectedSheet.description && (
                  <div style={{ marginTop: '0.75rem', backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#475569', display: 'block' }}>📝 Explicação / Observação do Autor:</strong>
                    <span style={{ color: '#334155', fontSize: '0.9rem' }}>{selectedSheet.description}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEditSheet(selectedSheet._id || selectedSheet.id)} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.5rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>✏️ Editar</button>
                <button onClick={() => setSelectedSheet(null)} style={{ backgroundColor: '#cbd5e1', color: '#334155', border: 'none', padding: '0.5rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>✕ Fechar</button>
              </div>
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
                    {selectedSheet.rows?.map((row, rowIndex) => {
                      let cellsToRender = Array.isArray(row) ? row : (row && typeof row === 'object' && Array.isArray(row.cells) ? row.cells : Object.values(row || {}));
                      return (
                        <tr key={rowIndex} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          {cellsToRender.map((cell, cellIndex) => {
                            const { value, comment } = renderCellData(cell);
                            return (
                              <td key={cellIndex} style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'space-between' }}>
                                  <span>{value}</span>
                                  {comment && (
                                    <span title={`Comentário da célula: ${comment}`} style={{ cursor: 'help', fontSize: '0.85rem', backgroundColor: '#fef3c7', padding: '0.1rem 0.30rem', borderRadius: '4px', border: '1px solid #fde68a' }}>💬</span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
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