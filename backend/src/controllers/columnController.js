import Column from '../models/Column.js';

const columnController = {
  // Buscar colunas de uma planilha específica
  getColumnsBySheet: async (req, res) => {
    try {
      const columns = await Column.find({ sheetId: req.params.sheetId }).sort({ order: 1 });
      return res.status(200).json(columns);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar colunas.', error: error.message });
    }
  },

  // Adicionar uma nova coluna na planilha
  createColumn: async (req, res) => {
    try {
      const { sheetId, name, type } = req.body;
      const newColumn = await Column.create({ sheetId, name, type });
      return res.status(201).json(newColumn);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao criar coluna.', error: error.message });
    }
  },

  // Deletar uma coluna
  deleteColumn: async (req, res) => {
    try {
      const deleted = await Column.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Coluna não encontrada.' });
      return res.status(200).json({ message: 'Coluna removida com sucesso.' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao apagar coluna.', error: error.message });
    }
  }
};

export default columnController;