import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:5000'; 

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para alertas e modais customizados
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
      // Se já está banido, confirma o desbanimento diretamente
      handleToggleBan(user, '');
    } else {
      // Se vai banir, abre a caixa estilizada para pedir a razão
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
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando lista de usuários...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      <h2>👥 Gerenciamento de Usuários</h2>

      {/* 🔴 Banner de Alerta Estilizado */}
      {alertInfo.show && (
        <div 
          style={{
            padding: '0.8rem 1.2rem',
            borderRadius: '6px',
            marginTop: '1rem',
            marginBottom: '1rem',
            fontWeight: '600',
            fontSize: '0.9rem',
            backgroundColor: alertInfo.type === 'error' ? '#fee2e2' : alertInfo.type === 'warning' ? '#fef3c7' : '#dcfce7',
            color: alertInfo.type === 'error' ? '#991b1b' : alertInfo.type === 'warning' ? '#92400e' : '#166534',
            border: `1px solid ${alertInfo.type === 'error' ? '#fca5a5' : alertInfo.type === 'warning' ? '#fde68a' : '#86efac'}`
          }}
        >
          {alertInfo.message}
        </div>
      )}

      {users.length === 0 ? (
        <p style={{ marginTop: '1rem' }}>Nenhum usuário encontrado no banco de dados.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem' }}>
          <thead>
            <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem' }}>Nome</th>
              <th style={{ padding: '0.75rem' }}>E-mail</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const userId = u.id || u._id;
              const userName = u.owner || u.name;

              return (
                <tr 
                  key={userId} 
                  style={{ 
                    borderBottom: '1px solid #e5e7eb', 
                    backgroundColor: u.isBanned ? '#fee2e2' : 'transparent' 
                  }}
                >
                  <td style={{ padding: '0.75rem' }}>
                    {u.isBanned ? (
                      <span style={{ color: '#dc2626', fontWeight: 'bold' }}>🔴 Banido</span>
                    ) : (
                      <span style={{ color: '#16a34a', fontWeight: 'bold' }}>🟢 Ativo</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem' }}>{userName}</td>
                  <td style={{ padding: '0.75rem' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDelete(userId, userName)} 
                      style={{ 
                        marginRight: '0.5rem',
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        padding: '0.4rem 0.7rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Excluir
                    </button>
                    <button 
                      onClick={() => openBanModal(u)} 
                      style={{ 
                        backgroundColor: u.isBanned ? '#16a34a' : '#ea580c', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '0.4rem 0.7rem', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                      }}
                    >
                      {u.isBanned ? 'Desbanir' : 'Banir'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* 🛑 Modal Estilizado para Motivo do Banimento */}
      {banModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginTop: 0 }}>Banir Usuário</h3>
            <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
              Informe o motivo do banimento para <strong>{banModal.user?.owner || banModal.user?.name}</strong>:
            </p>
            <input 
              type="text" 
              placeholder="Ex: Violação dos termos de uso" 
              value={banModal.reason}
              onChange={(e) => setBanModal({ ...banModal, reason: e.target.value })}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                marginTop: '0.5rem',
                marginBottom: '1rem',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button 
                onClick={() => setBanModal({ show: false, user: null, reason: '' })}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#fff',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleToggleBan(banModal.user, banModal.reason || 'Violação dos termos')}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#dc2626',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
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