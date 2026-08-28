import React, { useEffect, useState } from 'react';

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
    return <div style={{ padding: '4rem 0', textAlign: 'center', color: '#64748b', fontFamily: 'sans-serif' }}>Carregando lista de usuários...</div>;
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem', fontWeight: '700' }}>👥 Gerenciamento de Usuários</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.95rem' }}>
          Controle permissões, acessos e ações administrativas dos usuários cadastrados.
        </p>
      </div>

      {/* Alerta Estilizado */}
      {alertInfo.show && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: '600',
          fontSize: '0.9rem',
          backgroundColor: alertInfo.type === 'error' ? '#fef2f2' : alertInfo.type === 'warning' ? '#fffbebf' : '#f0fdf4',
          color: alertInfo.type === 'error' ? '#991b1b' : alertInfo.type === 'warning' ? '#b45309' : '#166534',
          border: `1px solid ${alertInfo.type === 'error' ? '#fecaca' : alertInfo.type === 'warning' ? '#fde68a' : '#bbf7d0'}`
        }}>
          {alertInfo.message}
        </div>
      )}

      {/* Tabela de Usuários */}
      {users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 2rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1' }}>
          <p style={{ color: '#64748b', margin: 0, fontSize: '1rem' }}>Nenhum usuário encontrado no banco de dados.</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Nome</th>
                <th style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>E-mail</th>
                <th style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'right' }}>Ações</th>
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
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: u.isBanned ? '#fef2f2' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {u.isBanned ? (
                        <span style={{ backgroundColor: '#fecdd3', color: '#9f1239', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>🔴 Banido</span>
                      ) : (
                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>🟢 Ativo</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#0f172a', fontWeight: '500', fontSize: '0.9rem' }}>{userName}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.9rem' }}>{u.email}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(userId, userName)} 
                        style={{ 
                          marginRight: '0.5rem',
                          backgroundColor: '#fecdd3',
                          color: '#9f1239',
                          border: '1px solid #fda4af',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        Excluir
                      </button>
                      <button 
                        onClick={() => openBanModal(u)} 
                        style={{ 
                          backgroundColor: u.isBanned ? '#2563eb' : '#ea580c', 
                          color: '#fff', 
                          border: 'none', 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '6px', 
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
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
        </div>
      )}

      {/* Modal para Motivo do Banimento */}
      {banModal.show && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.75rem',
            borderRadius: '12px',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginTop: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: '700' }}>⚠️ Banir Usuário</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0.5rem 0 1rem' }}>
              Informe o motivo do banimento para <strong>{banModal.user?.owner || banModal.user?.name}</strong>:
            </p>
            <input 
              type="text" 
              placeholder="Ex: Violação dos termos de uso" 
              value={banModal.reason}
              onChange={(e) => setBanModal({ ...banModal, reason: e.target.value })}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                marginBottom: '1.25rem',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button 
                onClick={() => setBanModal({ show: false, user: null, reason: '' })}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleToggleBan(banModal.user, banModal.reason || 'Violação dos termos')}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#dc2626',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
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