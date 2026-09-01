import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MySheets.css';

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
    <div className="mysheets-container">
      
      {errorMessage && (
        <div className="error-banner">
          <span> {errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="error-close-btn">✕</button>
        </div>
      )}

      {/* Cabeçalho Minhas Planilhas */}
      <div className="mysheets-header">
        <div>
          <h1 className="mysheets-title"> Minhas Planilhas</h1>
          <p className="mysheets-subtitle">
            {userName ? `Olá, ${userName}! ` : ''}Gerencie e visualize suas planilhas salvas.
          </p>
        </div>

        {sheets.length > 0 && (
          <button onClick={() => navigate('/create-sheet')} className="btn-primary-sheet">
            ➕ Nova Planilha
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-container">
          <p>⌛ A carregar planilhas...</p>
        </div>
      ) : sheets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <h2>Nenhuma planilha encontrada</h2>
          <button onClick={() => navigate('/create-sheet')} className="btn-primary-sheet">
             Criar Primeira Planilha
          </button>
        </div>
      ) : (
        <div className="mysheets-grid">
          {sheets.map((sheet) => {
            const currentId = sheet._id || sheet.id;

            return (
              <div key={currentId} className="sheet-card">
                <div>
                  <div className="sheet-card-header">
                    <span className="sheet-icon"></span>
                    <h3 className="sheet-card-title">
                      {sheet.title || 'Planilha Sem Título'}
                    </h3>
                  </div>

                  {/*  OBSERVAÇÕES E EXPLICAÇÕES DO AUTOR */}
                  <div className="sheet-author-box">
                    <span className="sheet-author-label">
                       Explicação do Autor:
                    </span>
                    <p className={`sheet-author-text ${!sheet.description ? 'italic' : ''}`}>
                      {sheet.description || 'Sem observações prestadas.'}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="sheet-badges">
                    <span className="badge-info">
                      {sheet.columns?.length || 0} Colunas
                    </span>
                    <span className="badge-info badge-rows">
                      {sheet.rows?.length || 0} Linhas
                    </span>
                  </div>

                  <div className="sheet-actions">
                    <button onClick={() => setSelectedSheet(sheet)} className="btn-view">
                       Ver
                    </button>
                    <button onClick={() => handleEditSheet(currentId)} className="btn-edit">
                       Editar
                    </button>
                    <button onClick={() => setSheetToDelete({ id: currentId, title: sheet.title })} className="btn-delete">
                      Excluir
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
        <div className="modal-overlay">
          <div className="modal-content modal-delete">
            <h3> Confirmar Exclusão</h3>
            <p>
              Deseja excluir a planilha <strong>"{sheetToDelete.title}"</strong>?
            </p>
            <div className="modal-actions">
              <button onClick={() => setSheetToDelete(null)} className="btn-cancel">
                Cancelar
              </button>
              <button onClick={confirmDeleteSheet} className="btn-confirm-delete">
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização */}
      {selectedSheet && (
        <div className="modal-overlay">
          <div className="modal-content modal-view">
            <div className="modal-view-header">
              <div>
                <h2> {selectedSheet.title}</h2>
                {selectedSheet.description && (
                  <div className="modal-author-box">
                    <strong> Explicação / Observação do Autor:</strong>
                    <span>{selectedSheet.description}</span>
                  </div>
                )}
              </div>

              <div className="modal-view-actions">
                <button onClick={() => handleEditSheet(selectedSheet._id || selectedSheet.id)} className="btn-edit">
                  ✏️ Editar
                </button>
                <button onClick={() => setSelectedSheet(null)} className="btn-cancel">
                  ✕ Fechar
                </button>
              </div>
            </div>

            {(!selectedSheet.columns || selectedSheet.columns.length === 0) && (!selectedSheet.rows || selectedSheet.rows.length === 0) ? (
              <p className="empty-table-text">Esta planilha não possui colunas ou dados cadastrados.</p>
            ) : (
              <div className="table-wrapper">
                <table className="sheet-table">
                  <thead>
                    <tr>
                      {selectedSheet.columns?.map((col, index) => (
                        <th key={index}>
                          {renderColumnHeader(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSheet.rows?.map((row, rowIndex) => {
                      let cellsToRender = Array.isArray(row) ? row : (row && typeof row === 'object' && Array.isArray(row.cells) ? row.cells : Object.values(row || {}));
                      return (
                        <tr key={rowIndex}>
                          {cellsToRender.map((cell, cellIndex) => {
                            const { value, comment } = renderCellData(cell);
                            return (
                              <td key={cellIndex}>
                                <div className="cell-content">
                                  <span>{value}</span>
                                  {comment && (
                                    <span title={`Comentário da célula: ${comment}`} className="cell-comment-icon"></span>
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