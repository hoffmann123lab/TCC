import Sheet from '../models/Sheet.js';

const sheetController = {
  // Buscar todas as planilhas (inclui os dados do criador)
  getSheets: async (req, res) => {
    try {
      const sheets = await Sheet.find()
        .populate('userId', 'name email role')
        .sort({ createdAt: -1 });
      return res.status(200).json(sheets);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar planilhas.', error: error.message });
    }
  },

  // Criar uma nova planilha vinculada ao usuário
  createSheet: async (req, res) => {
    try {
      const { title, description, columns, rows, userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: 'O ID do usuário (userId) é obrigatório.' });
      }

      const newSheet = await Sheet.create({
        title,
        description,
        columns,
        rows,
        userId
      });

      return res.status(201).json(newSheet);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao criar planilha.', error: error.message });
    }
  },

  // Atualizar planilha
  updateSheet: async (req, res) => {
    try {
      const updatedSheet = await Sheet.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true }
      );
      if (!updatedSheet) return res.status(404).json({ message: 'Planilha não encontrada.' });
      return res.status(200).json(updatedSheet);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao atualizar planilha.', error: error.message });
    }
  },

  // Deletar planilha
  deleteSheet: async (req, res) => {
    try {
      const deleted = await Sheet.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Planilha não encontrada.' });
      return res.status(200).json({ message: 'Planilha removida com sucesso.' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao apagar planilha.', error: error.message });
    }
  }
};

export default sheetController;