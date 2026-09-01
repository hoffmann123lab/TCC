import React, { useEffect, useState } from 'react';
import './AdminUsersPage.css';

const API_BASE_URL = 'http://localhost:5000'; 

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: 'info' });
  const [banModal, setBanModal] = useState({ show: false, user: null, reason: '' });

  const showAlert = (message, type = 'info') => {
    setAlertInfo({ show: true, message, type });
    setTimeout(() => {
      setAlertInfo({ show: false, message: '', type: 'info' });
    }, 4000);
  };

  const fetchUsers = async () => {
    try {
      const storedData = localStorage.getItem('user_data') || localStorage.getItem('user');
      const parsedData = storedData ? JSON.parse(storedData) : {};
      const loggedUser = parsedData.user || parsedData;
      const adminId = loggedUser._id || loggedUser.id;

      let response = await fetch(`${API_BASE_URL}/api/users`);
      
      if (!response.ok && adminId) {
        response = await fetch(`${API_BASE_URL}/api/users/admin/folders?adminId=${adminId}`);
      }

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setUsers(data);
      } else {
        showAlert(data.message || 'Erro ao carregar lista de usuários.', 'error');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      showAlert('Erro de conexão com o servidor.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário ${name}?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setUsers(users.filter((u) => (u.id || u._id) !== id));
        showAlert(`Usuário ${name} excluído com sucesso!`, 'success');
      } else {
        const err = await response.json();
        showAlert(err.message || 'Erro ao excluir usuário.', 'error');
      }
    } catch (error) {
      showAlert('Erro de rede ao excluir usuário.', 'error');
    }
  };

  const openBanModal = (user) => {
    if (user.isBanned) {
      handleToggleBan(user, '');
    } else {
      setBanModal({ show: true, user, reason: '' });
    }
  };

  const handleToggleBan = async (user, reasonToBan) => {
    const userId = user.id || user._id;
    const isBanning = !user.isBanned;

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/admin/users/${userId}/ban`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBanned: isBanning, reason: reasonToBan })
      });

      if (response.ok) {
        setUsers(users.map((u) => {
          const currentId = u.id || u._id;
          return currentId === userId ? { ...u, isBanned: isBanning, banReason: reasonToBan } : u;
        }));
        showAlert(
          `Usuário ${user.owner || user.name} foi ${isBanning ? 'banido' : 'desbanido'} com sucesso!`,
          isBanning ? 'warning' : 'success'
        );
      } else {
        const err = await response.json();
        showAlert(err.message || 'Erro ao alterar banimento.', 'error');
      }
    } catch (error) {
      showAlert('Erro ao alterar status de banimento.', 'error');
    } finally {
      setBanModal({ show: false, user: null, reason: '' });
    }
  };

  if (loading) {
    return <div className="admin-loading">Carregando lista de usuários...</div>;
  }

  return (
    <div className="admin-users-container">
      <div className="admin-header">
        <h1 className="admin-header-title"> Gerenciamento de Usuários</h1>
        <p className="admin-header-subtitle">
          Controle permissões, acessos e ações administrativas dos usuários cadastrados.
        </p>
      </div>

      {alertInfo.show && (
        <div className={`alert-banner alert-${alertInfo.type}`}>
          {alertInfo.message}
        </div>
      )}

      {users.length === 0 ? (
        <div className="empty-users-card">
          <p>Nenhum usuário encontrado no banco de dados.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th className="align-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const userId = u.id || u._id;
                const userName = u.owner || u.name;

                return (
                  <tr key={userId} className={u.isBanned ? 'row-banned' : ''}>
                    <td>
                      {u.isBanned ? (
                        <span className="badge-status badge-banned">🔴 Banido</span>
                      ) : (
                        <span className="badge-status badge-active">🟢 Ativo</span>
                      )}
                    </td>
                    <td className="user-name">{userName}</td>
                    <td className="user-email">{u.email}</td>
                    <td className="actions-cell">
                      <button 
                        onClick={() => handleDelete(userId, userName)} 
                        className="btn-action-delete"
                      >
                        Excluir
                      </button>
                      <button 
                        onClick={() => openBanModal(u)} 
                        className={`btn-action-ban ${u.isBanned ? 'unban' : ''}`}
                      >
                        {u.isBanned ? 'Desbanir' : 'Banir'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {banModal.show && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 className="modal-title">⚠️ Banir Usuário</h3>
            <p className="modal-description">
              Informe o motivo do banimento para <strong>{banModal.user?.owner || banModal.user?.name}</strong>:
            </p>
            <input 
              type="text" 
              placeholder="Ex: Violação dos termos de uso" 
              value={banModal.reason}
              onChange={(e) => setBanModal({ ...banModal, reason: e.target.value })}
              className="modal-input"
            />
            <div className="modal-footer">
              <button 
                onClick={() => setBanModal({ show: false, user: null, reason: '' })}
                className="btn-modal-cancel"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleToggleBan(banModal.user, banModal.reason || 'Violação dos termos')}
                className="btn-modal-confirm"
              >
                Confirmar Banimento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}