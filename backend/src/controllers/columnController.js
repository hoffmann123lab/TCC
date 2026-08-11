const Column = require('../models/Column');

// Buscar colunas de uma planilha específica
exports.getColumnsBySheet = async (req, res) => {
  try {
    const columns = await Column.find({ sheetId: req.params.sheetId }).sort({ order: 1 });
    res.json(columns);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar colunas.', error: error.message });
  }
};

// Adicionar uma nova coluna na planilha
exports.createColumn = async (req, res) => {
  try {
    const { sheetId, name, type } = req.body;
    const newColumn = await Column.create({ sheetId, name, type });
    res.status(201).json(newColumn);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar coluna.', error: error.message });
  }
};

// Deletar uma coluna
exports.deleteColumn = async (req, res) => {
  try {
    const deleted = await Column.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Coluna não encontrada.' });
    res.json({ message: 'Coluna removida com sucesso.' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao apagar coluna.', error: error.message });
  }
};