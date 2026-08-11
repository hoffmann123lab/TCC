import api from './api';

// ==========================================
// 📊 SERVIÇOS DE PLANILHAS (Sheets)
// ==========================================

export const getSheets = async () => {
  const response = await api.get('/sheets');
  return response.data;
};

export const createSheet = async (sheetData) => {
  const response = await api.post('/sheets', sheetData);
  return response.data;
};

export const deleteSheet = async (id) => {
  const response = await api.delete(`/sheets/${id}`);
  return response.data;
};

// ==========================================
// 🏛️ SERVIÇOS DE COLUNAS (Columns)
// ==========================================

export const getColumnsBySheet = async (sheetId) => {
  const response = await api.get(`/columns/${sheetId}`);
  return response.data;
};

export const createColumn = async (columnData) => {
  const response = await api.post('/columns', columnData);
  return response.data;
};

// ==========================================
// 📝 SERVIÇOS DE LINHAS / CÉLULAS (Rows)
// ==========================================

export const getRowsBySheet = async (sheetId) => {
  const response = await api.get(`/rows/${sheetId}`);
  return response.data;
};

export const createRow = async (rowData) => {
  const response = await api.post('/rows', rowData);
  return response.data;
};

export const updateRow = async (id, rowData) => {
  const response = await api.put(`/rows/${id}`, rowData);
  return response.data;
};

export const deleteRow = async (id) => {
  const response = await api.delete(`/rows/${id}`);
  return response.data;
};