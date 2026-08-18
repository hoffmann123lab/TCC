import Row from '../models/Row.js';

const rowController = {
  getRowsBySheet: async (req, res) => {
    try {
      const rows = await Row.find({ sheetId: req.params.sheetId }).sort({ createdAt: -1 });
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar dados da planilha.', error: error.message });
    }
  },

  createRow: async (req, res) => {
    try {
      const { sheetId, data } = req.body;
      const newRow = await Row.create({ sheetId, data });
      return res.status(201).json(newRow);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao inserir linha.', error: error.message });
    }
  },

  updateRow: async (req, res) => {
    try {
      const { data } = req.body;
      const updatedRow = await Row.findByIdAndUpdate(
        req.params.id,
        { data },
        { new: true }
      );
      if (!updatedRow) return res.status(404).json({ message: 'Linha não encontrada.' });
      return res.status(200).json(updatedRow);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao atualizar linha.', error: error.message });
    }
  },

  deleteRow: async (req, res) => {
    try {
      const deleted = await Row.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Linha não encontrada.' });
      return res.status(200).json({ message: 'Linha removida com sucesso.' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao apagar linha.', error: error.message });
    }
  }
};

export default rowController;