import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageSheets.css';

const ALLOWED_ADMIN_EMAILS = [
  'rafaelhoffmann@gmail.com',
  'samuelcunha@gmail.com'
];

export default function ManageSheets() {
  const [userFolders, setUserFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(null);
  
  // Estado para substituir alerts bloqueantes
  const [errorMessage, setErrorMessage] = useState('');

  // ESTADOS PARA A GESTÃO DE COMENTÁRIOS
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSendingComment, setIsSendingComment] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFolders() {
      try {
        setLoading(true);

        // 1. Busca os dados salvos no localStorage
        const storedData = localStorage.getItem('user_data') || localStorage.getItem('user');
        if (!storedData) {
          setErrorMessage('Sessão expirada. Redirecionando para o login...');
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        const parsedData = JSON.parse(storedData);
        
        // Garante a leitura correta caso venha como { user: { ... } } ou direto { ... }
        const user = parsedData.user || parsedData;
        const userId = user._id || user.id;
        const userEmail = user.email ? user.email.toLowerCase().trim() : '';

        // 2. Valida se o e-mail pertence aos administradores permitidos
        if (!ALLOWED_ADMIN_EMAILS.includes(userEmail)) {
          setErrorMessage('Acesso restrito a administradores autorizados! Redirecionando...');
          setTimeout(() => navigate('/dashboard'), 2000);
          return;
        }

        // 3. Faz a requisição ao Backend enviando o ID do Administrador
        const response = await fetch(`http://localhost:5000/api/users/admin/folders?adminId=${userId}`);

        if (response.ok) {
          const data = await response.json();
          setUserFolders(Array.isArray(data) ? data : []);
        } else {
          const errData = await response.json().catch(() => ({}));
          setErrorMessage(errData.message || 'Você não tem permissão para acessar estas pastas.');
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      } catch (error) {
        console.error('Erro ao buscar pastas no servidor:', error);
        setUserFolders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFolders();
  }, [navigate]);

  // QUANDO O ADM ABRE UMA PLANILHA, CARREGA OS COMENTÁRIOS EXISTENTES
  const handleOpenSheet = (sheet) => {
    setSelectedSheet(sheet);
    setComments(sheet.comments || []);
    setNewCommentText('');
  };

  // FUNÇÃO PARA O ADMINISTRADOR ENVIAR UM COMENTÁRIO
  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedSheet) return;

    const sheetId = selectedSheet._id || selectedSheet.id;

    if (!sheetId) {
      setErrorMessage('Erro ao identificar o ID da planilha.');
      return;
    }

    setIsSendingComment(true);

    try {
      const storedData = localStorage.getItem('user_data') || localStorage.getItem('user');
      const parsedData = storedData ? JSON.parse(storedData) : null;
      const user = parsedData?.user || parsedData;
      const adminName = user?.name || 'Administrador';

      const response = await fetch(`http://localhost:5000/api/sheets/${sheetId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: adminName,
          text: newCommentText
        })
      });

      const data = await response.json();

      if (response.ok) {
        setComments(data.comments);
        setNewCommentText('');
      } else {
        setErrorMessage(data.message || 'Erro ao enviar o comentário.');
      }
    } catch (error) {
      console.error('Erro ao salvar comentário:', error);
      setErrorMessage('Erro de conexão ao tentar salvar o comentário.');
    } finally {
      setIsSendingComment(false);
    }
  };

  const filteredFolders = userFolders.filter(
    (folder) =>
      folder.folderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folder.owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folder.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-sheets-container">
      
      {/* Banner de erro/aviso no topo */}
      {errorMessage && (
        <div className="manage-sheets-error-banner">
          <span>⚠️ {errorMessage}</span>
          <button 
            onClick={() => setErrorMessage('')}
            className="manage-sheets-close-btn"
          >
            ✕
          </button>
        </div>
      )}

      <div className="manage-sheets-header">
        <div>
          <h1 className="manage-sheets-title"> Pastas dos Utilizadores</h1>
          <p className="manage-sheets-subtitle">
            Painel do Administrador: Gerencie as pastas criadas pelos usuários.
          </p>
        </div>

        <input
          type="text"
          placeholder="🔍 Buscar por pasta, criador ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="manage-sheets-search-input"
        />
      </div>

      {loading ? (
        <p className="manage-sheets-info-text">A carregar pastas do banco de dados...</p>
      ) : userFolders.length === 0 ? (
        <div className="manage-sheets-empty-card">
          <p className="manage-sheets-empty-text">Nenhuma pasta foi encontrada.</p>
        </div>
      ) : (
        <>
          <div className="manage-sheets-folders-grid">
            {filteredFolders.map((folder) => (
              <div
                key={folder.id || folder._id}
                onClick={() => setSelectedFolder(folder)}
                className="manage-sheets-folder-card"
              >
                <div className="manage-sheets-folder-icon">📁</div>
                <h3 className="manage-sheets-folder-name">{folder.folderName}</h3>
                <p className="manage-sheets-folder-owner">
                  Criador: <strong>{folder.owner}</strong>
                </p>
                <p className="manage-sheets-folder-email">{folder.email}</p>
                <span className="manage-sheets-folder-badge">
                  {folder.sheets?.length || 0} {folder.sheets?.length === 1 ? 'planilha' : 'planilhas'}
                </span>
              </div>
            ))}
          </div>

          {selectedFolder && (
            <div className="manage-sheets-folder-details">
              <div className="manage-sheets-details-header">
                <div>
                  <h2 className="manage-sheets-details-title">📂 Pasta: {selectedFolder.folderName}</h2>
                  <p className="manage-sheets-details-owner">Proprietário: {selectedFolder.owner} ({selectedFolder.email})</p>
                </div>
                <button onClick={() => setSelectedFolder(null)} className="manage-sheets-btn-gray">
                  ✕ Fechar
                </button>
              </div>

              {selectedFolder.sheets?.length === 0 ? (
                <p className="manage-sheets-info-text">Esta pasta está vazia.</p>
              ) : (
                <table className="manage-sheets-table">
                  <thead>
                    <tr className="manage-sheets-thead-tr">
                      <th className="manage-sheets-th">NOME DA PLANILHA</th>
                      <th className="manage-sheets-th">LINHAS</th>
                      <th className="manage-sheets-th manage-sheets-td-center">AÇÃO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFolder.sheets?.map((sheet, index) => (
                      <tr key={index} className="manage-sheets-tbody-tr">
                        <td className="manage-sheets-td-title"> {sheet.title}</td>
                        <td className="manage-sheets-td">{sheet.rows?.length || 0}</td>
                        <td className="manage-sheets-td-center">
                          <button onClick={() => handleOpenSheet(sheet)} className="manage-sheets-btn-blue">
                            👁️ Abrir Planilha
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}

      {/* MODAL DE VISUALIZAÇÃO DA PLANILHA COM ÁREA DE COMENTÁRIOS */}
      {selectedSheet && (
        <div className="manage-sheets-modal-overlay">
          <div className="manage-sheets-modal-content">
            <div className="manage-sheets-modal-header">
              <h2 className="manage-sheets-modal-title"> {selectedSheet.title}</h2>
              <button onClick={() => setSelectedSheet(null)} className="manage-sheets-btn-gray">
                ✕ Fechar
              </button>
            </div>

            {/* TABELA DA PLANILHA */}
            <div className="manage-sheets-table-wrapper">
              <table className="manage-sheets-table">
                <thead>
                  <tr className="manage-sheets-modal-thead-tr">
                    {selectedSheet.columns?.map((col, index) => (
                      <th key={index} className="manage-sheets-modal-th">
                        {typeof col === 'object' ? col.name : col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedSheet.rows?.map((row, rowIndex) => (
                    <tr key={rowIndex} className="manage-sheets-tbody-tr">
                      {Array.isArray(row) ? (
                        row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="manage-sheets-td">
                            {typeof cell === 'object' ? JSON.stringify(cell) : cell}
                          </td>
                        ))
                      ) : typeof row === 'object' ? (
                        Object.values(row).map((cell, cellIndex) => (
                          <td key={cellIndex} className="manage-sheets-td">
                            {typeof cell === 'object' ? JSON.stringify(cell) : cell}
                          </td>
                        ))
                      ) : (
                        <td className="manage-sheets-td">{row}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SEÇÃO DE COMENTÁRIOS DO ADMINISTRADOR */}
            <div className="manage-sheets-comments-section">
              <h3 className="manage-sheets-comments-title">
                 Comentários e Observações do Administrador
              </h3>

              {/* LISTA DE COMENTÁRIOS */}
              <div className="manage-sheets-comments-list">
                {comments.length === 0 ? (
                  <p className="manage-sheets-empty-comments">
                    Nenhum comentário registrado nesta planilha ainda.
                  </p>
                ) : (
                  comments.map((comment, index) => (
                    <div key={index} className="manage-sheets-comment-card">
                      <div className="manage-sheets-comment-header">
                        <strong className="manage-sheets-comment-author">{comment.author}</strong>
                        {comment.createdAt && (
                          <span className="manage-sheets-comment-date">
                            {new Date(comment.createdAt).toLocaleDateString('pt-BR')} às {new Date(comment.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="manage-sheets-comment-text">
                        {comment.text}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* FORMULÁRIO PARA ENVIAR COMENTÁRIO */}
              <form onSubmit={handleSendComment} className="manage-sheets-comment-form">
                <input
                  type="text"
                  placeholder="Escreva uma observação ou instrução para este usuário..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="manage-sheets-comment-input"
                />
                <button
                  type="submit"
                  disabled={isSendingComment}
                  className="manage-sheets-btn-submit"
                >
                  {isSendingComment ? 'Enviando...' : 'Comentar'}
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}