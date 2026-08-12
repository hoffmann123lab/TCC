import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Dashboard() {
  const navigate = useNavigate();

  // Estados para controlar o Modal de criação de planilha
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSheetTitle, setNewSheetTitle] = useState('');

  // Submissão do formulário do Modal
  const handleCreateSheetSubmit = (e) => {
    e.preventDefault();

    if (!newSheetTitle.trim()) return;

    // Gera um ID único para a nova planilha
    const newSheetId = `sheet-${Date.now()}`;

    // Limpa e fecha o modal
    setIsModalOpen(false);
    setNewSheetTitle('');

    // Redireciona para a tela de edição passando o título escolhido
    navigate(`/sheet/${newSheetId}`, {
      state: { title: newSheetTitle }
    });
  };

  return (
    <div className="app-container">
      {/* Cabeçalho da Dashboard */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Minhas Planilhas</h1>
          <p className="page-subtitle">Gerencie suas planilhas e organize seus dados em um só lugar.</p>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid-cards">
        {/* Card: Criar Nova Planilha */}
        <div className="card card-create-new" onClick={() => setIsModalOpen(true)}>
          <div className="create-icon-wrapper">
            <span className="create-icon">+</span>
          </div>
          <h3 className="card-title" style={{ marginTop: '0.8rem' }}>Criar Nova Planilha</h3>
          <p className="card-subtitle-text">Comece uma tabela do zero</p>
        </div>
      </div>

      {/* MODAL / POPUP DE CRIAÇÃO */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Nova Planilha</h2>
            <p>Digite o nome para a sua nova planilha:</p>

            <form onSubmit={handleCreateSheetSubmit}>
              <input
                type="text"
                className="modal-input"
                placeholder="Ex: Minhas Finanças 2026..."
                value={newSheetTitle}
                onChange={(e) => setNewSheetTitle(e.target.value)}
                autoFocus
                required
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Criar Planilha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}