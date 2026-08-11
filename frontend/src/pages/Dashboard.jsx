import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSheets, createSheet, deleteSheet } from '../services/sheetService';

export default function Dashboard() {
  const [sheets, setSheets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Carrega as planilhas assim que a tela monta (sem função externa)
  useEffect(() => {
    getSheets()
      .then((data) => {
        setSheets(data);
      })
      .catch((error) => {
        console.error('Erro ao carregar planilhas:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Informe o título da planilha!');

    try {
      const newSheet = await createSheet({ title, description });
      // Atualiza o estado diretamente adicionando a nova planilha na lista
      setSheets((prevSheets) => [...prevSheets, newSheet]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Erro ao criar planilha:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta planilha?')) {
      try {
        await deleteSheet(id);
        // Remove a planilha do estado diretamente sem precisar recarregar
        setSheets((prevSheets) => prevSheets.filter((s) => s._id !== id));
      } catch (error) {
        console.error('Erro ao deletar planilha:', error);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Minhas Planilhas</h1>

      <div className="create-sheet-card">
        <h3>Criar Nova Planilha</h3>
        <form onSubmit={handleCreate}>
          <input 
            type="text" 
            placeholder="Título da planilha" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Descrição (opcional)" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
          <button type="submit" className="btn btn-primary">Criar</button>
        </form>
      </div>

      {loading ? (
        <p>Carregando planilhas...</p>
      ) : (
        <div className="sheets-grid">
          {sheets.length === 0 ? (
            <p>Nenhuma planilha encontrada. Crie a sua primeira acima!</p>
          ) : (
            sheets.map((sheet) => (
              <div key={sheet._id} className="sheet-card">
                <div onClick={() => navigate(`/sheet/${sheet._id}`)} style={{ cursor: 'pointer' }}>
                  <h3>📊 {sheet.title}</h3>
                  <p>{sheet.description || 'Sem descrição'}</p>
                </div>
                <button 
                  onClick={() => handleDelete(sheet._id)} 
                  className="btn-danger-sm"
                >
                  Excluir
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}