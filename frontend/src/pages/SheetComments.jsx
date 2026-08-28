import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:5000';

export default function SheetComments({ sheetId, initialComments = [], isAdmin }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

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
        alert(data.message || 'Erro ao enviar comentário.');
      }
    } catch (error) {
      console.error('Erro ao comentar:', error);
    }
  };

  return (
    <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <h4>💬 Comentários</h4>

      <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
        {comments.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Nenhum comentário ainda.</p>
        ) : (
          comments.map((c, index) => (
            <div key={index} style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
              <strong>{c.author}:</strong> <p style={{ margin: 0, fontSize: '0.9rem' }}>{c.text}</p>
            </div>
          ))
        )}
      </div>

      {isAdmin && (
        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Escreva um comentário para o usuário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
          <button
            type="submit"
            style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Enviar
          </button>
        </form>
      )}
    </div>
  );
}