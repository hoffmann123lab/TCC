import React from 'react';

export default function Table({ columns, rows, onCellChange, onDeleteRow, onAddColumn }) {
  const [newColName, setNewColName] = React.useState('');

  const handleAddCol = (e) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    onAddColumn(newColName);
    setNewColName('');
  };

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col._id}>{col.name}</th>
            ))}
            <th className="add-col-header">
              <form onSubmit={handleAddCol} style={{ display: 'flex', gap: '5px' }}>
                <input
                  type="text"
                  placeholder="+ Nova Coluna"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                />
                <button type="submit" className="btn-sm">+</button>
              </form>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '20px' }}>
                Nenhum dado cadastrado nesta planilha.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row._id}>
                {columns.map((col) => (
                  <td key={col._id}>
                    <input
                      type="text"
                      value={row.data?.[col._id] || ''}
                      onChange={(e) => onCellChange(row._id, col._id, e.target.value)}
                    />
                  </td>
                ))}
                <td>
                  <button onClick={() => onDeleteRow(row._id)} className="btn-danger-sm">
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}