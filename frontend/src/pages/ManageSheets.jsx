import { useState, useEffect } from 'react';

export default function ManageSheets() {
  const [userFolders, setUserFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(null);

  useEffect(() => {
    async function fetchFolders() {
      try {
        // 🟢 URL atualizada para a rota /api/users/admin/folders
        const response = await fetch('http://localhost:5000/api/users/admin/folders');
        if (response.ok) {
          const data = await response.json();
          setUserFolders(data);
        }
      } catch (error) {
        console.error('Erro ao buscar pastas do backend:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFolders();
  }, []);

  const filteredFolders = userFolders.filter(
    (folder) =>
      folder.folderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folder.owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folder.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, color: '#0f172a' }}>📁 Pastas dos Utilizadores</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
            Painel do Administrador: Gerencie as pastas criadas pelos usuários.
          </p>
        </div>

        <input
          type="text"
          placeholder="🔍 Buscar por pasta, criador ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.6rem 1rem', width: '320px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
        />
      </div>

      {loading ? (
        <p>A carregar pastas do banco de dados...</p>
      ) : userFolders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '1.2rem', color: '#64748b', margin: 0 }}>Nenhuma pasta foi criada por nenhum usuário ainda.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {filteredFolders.map((folder) => (
              <div
                key={folder.id || folder._id}
                onClick={() => setSelectedFolder(folder)}
                style={{
                  backgroundColor: '#fff',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.1rem' }}>{folder.folderName}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  Criador: <strong>{folder.owner}</strong>
                </p>
                <p style={{ margin: '0.25rem 0 0.75rem 0', fontSize: '0.8rem', color: '#94a3b8' }}>{folder.email}</p>
                <span style={{ fontSize: '0.8rem', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.6rem', borderRadius: '12px', fontWeight: 'bold' }}>
                  {folder.sheets?.length || 0} {folder.sheets?.length === 1 ? 'planilha' : 'planilhas'}
                </span>
              </div>
            ))}
          </div>

          {selectedFolder && (
            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ margin: 0, color: '#0f172a' }}>📂 Pasta: {selectedFolder.folderName}</h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Proprietário: {selectedFolder.owner} ({selectedFolder.email})</p>
                </div>
                <button onClick={() => setSelectedFolder(null)} style={{ backgroundColor: '#94a3b8', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>
                  ✕ Fechar
                </button>
              </div>

              {selectedFolder.sheets?.length === 0 ? (
                <p style={{ color: '#94a3b8' }}>Esta pasta está vazia.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.85rem' }}>
                      <th style={{ padding: '0.75rem' }}>NOME DA PLANILHA</th>
                      <th style={{ padding: '0.75rem' }}>LINHAS</th>
                      <th style={{ padding: '0.75rem', textAlign: 'center' }}>AÇÃO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFolder.sheets?.map((sheet, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#1e293b' }}>📊 {sheet.title}</td>
                        <td style={{ padding: '0.75rem', color: '#475569' }}>{sheet.rows?.length || 0}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <button onClick={() => setSelectedSheet(sheet)} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.3rem 0.7rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
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

      {selectedSheet && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: 0, color: '#0f172a' }}>📌 {selectedSheet.title}</h2>
              <button onClick={() => setSelectedSheet(null)} style={{ backgroundColor: '#94a3b8', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>
                ✕ Fechar
              </button>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                    {selectedSheet.columns?.map((col, index) => (
                      <th key={index} style={{ padding: '0.75rem', fontWeight: 'bold', color: '#334155' }}>
                        {typeof col === 'object' ? col.name : col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedSheet.rows?.map((row, rowIndex) => (
                    <tr key={rowIndex} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {Array.isArray(row) ? (
                        row.map((cell, cellIndex) => (
                          <td key={cellIndex} style={{ padding: '0.75rem', color: '#475569' }}>
                            {typeof cell === 'object' ? JSON.stringify(cell) : cell}
                          </td>
                        ))
                      ) : typeof row === 'object' ? (
                        Object.values(row).map((cell, cellIndex) => (
                          <td key={cellIndex} style={{ padding: '0.75rem', color: '#475569' }}>
                            {typeof cell === 'object' ? JSON.stringify(cell) : cell}
                          </td>
                        ))
                      ) : (
                        <td style={{ padding: '0.75rem', color: '#475569' }}>{row}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}