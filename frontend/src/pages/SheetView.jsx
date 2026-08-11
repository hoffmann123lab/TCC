import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import { 
  getColumnsBySheet, 
  createColumn, 
  getRowsBySheet, 
  createRow, 
  updateRow, 
  deleteRow 
} from '../services/sheetService';

export default function SheetView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega colunas e linhas direto no useEffect usando Promise.all
  useEffect(() => {
    Promise.all([getColumnsBySheet(id), getRowsBySheet(id)])
      .then(([colsData, rowsData]) => {
        setColumns(colsData);
        setRows(rowsData);
      })
      .catch((error) => {
        console.error('Erro ao carregar dados da planilha:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddColumn = async (name) => {
    try {
      const newCol = await createColumn({ sheetId: id, name });
      setColumns((prev) => [...prev, newCol]);
    } catch (error) {
      console.error('Erro ao adicionar coluna:', error);
    }
  };

  const handleAddRow = async () => {
    try {
      const newRow = await createRow({ sheetId: id, data: {} });
      setRows((prev) => [...prev, newRow]);
    } catch (error) {
      console.error('Erro ao adicionar linha:', error);
    }
  };

  const handleCellChange = async (rowId, colId, value) => {
    const updatedRows = rows.map((r) => {
      if (r._id === rowId) {
        return { ...r, data: { ...r.data, [colId]: value } };
      }
      return r;
    });
    setRows(updatedRows);

    const currentRow = updatedRows.find((r) => r._id === rowId);
    try {
      await updateRow(rowId, { data: currentRow.data });
    } catch (error) {
      console.error('Erro ao salvar alteração da célula:', error);
    }
  };

  const handleDeleteRow = async (rowId) => {
    try {
      await deleteRow(rowId);
      setRows((prev) => prev.filter((r) => r._id !== rowId));
    } catch (error) {
      console.error('Erro ao deletar linha:', error);
    }
  };

  return (
    <div className="sheet-view-container">
      <button onClick={() => navigate('/')} className="btn-back">
        ⬅ Voltar para Dashboard
      </button>

      <div className="sheet-actions">
        <button onClick={handleAddRow} className="btn btn-primary">
          + Nova Linha
        </button>
      </div>

      {loading ? (
        <p>Carregando dados...</p>
      ) : (
        <Table 
          columns={columns} 
          rows={rows} 
          onCellChange={handleCellChange} 
          onDeleteRow={handleDeleteRow} 
          onAddColumn={handleAddColumn} 
        />
      )}
    </div>
  );
}