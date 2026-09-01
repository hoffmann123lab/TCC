import React, { useState } from 'react';
import './SheetComments.css';

const API_BASE_URL = 'http://localhost:5000';

export default function SheetComments({ sheetId, initialComments = [], isAdmin }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setErrorMessage('');

    const storedData = localStorage.getItem('user_data') || localStorage.getItem('user');
    const parsedData = storedData ? JSON.parse(storedData) : {};
    const loggedUser = parsedData.user || parsedData;

    try {
      const response = await fetch(`${API_BASE_URL}/api/sheets/${sheetId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: loggedUser.name || 'Administrador',
          text: newComment
        })
      });

      const data = await response.json();
      if (response.ok) {
        setComments(data.comments);
        setNewComment('');
      } else {
        setErrorMessage(data.message || 'Erro ao enviar comentário.');
      }
    } catch (error) {
      console.error('Erro ao comentar:', error);
      setErrorMessage('Erro de conexão ao enviar o comentário.');
    }
  };

  return (
    <div className="sheet-comments-container">
      <h4 className="sheet-comments-title">💬 Comentários</h4>

      {errorMessage && (
        <div className="sheet-comments-error-banner">
          <span>⚠️ {errorMessage}</span>
          <button 
            onClick={() => setErrorMessage('')} 
            className="sheet-comments-close-btn"
          >
            ✕
          </button>
        </div>
      )}

      <div className="sheet-comments-list">
        {comments.length === 0 ? (
          <p className="sheet-comments-empty">Nenhum comentário ainda.</p>
        ) : (
          comments.map((c, index) => (
            <div key={index} className="sheet-comment-card">
              <strong className="sheet-comment-author">{c.author}:</strong>{' '}
              <p className="sheet-comment-text">{c.text}</p>
            </div>
          ))
        )}
      </div>

      {isAdmin && (
        <form onSubmit={handleAddComment} className="sheet-comments-form">
          <input
            type="text"
            placeholder="Escreva um comentário para o usuário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="sheet-comments-input"
          />
          <button type="submit" className="sheet-comments-btn-submit">
            Enviar
          </button>
        </form>
      )}
    </div>
  );
}