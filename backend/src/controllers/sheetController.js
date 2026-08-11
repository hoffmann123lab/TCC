const Sheet = require('../models/Sheet');

// Buscar todas as planilhas
exports.getSheets = async (req, res) => {
  try {
    const sheets = await Sheet.find().sort({ createdAt: -1 });
    res.json(sheets);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar planilhas.', error: error.message });
  }
};

// Criar uma nova planilha
exports.createSheet = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newSheet = await Sheet.create({ title, description });
    res.status(201).json(newSheet);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar planilha.', error: error.message });
  }
};

// Atualizar título/descrição da planilha
exports.updateSheet = async (req, res) => {
  try {
    const updatedSheet = await Sheet.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!updatedSheet) return res.status(404).json({ message: 'Planilha não encontrada.' });
    res.json(updatedSheet);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar planilha.', error: error.message });
  }
};

// Deletar planilha
exports.deleteSheet = async (req, res) => {
  try {
    const deleted = await Sheet.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Planilha não encontrada.' });
    res.json({ message: 'Planilha removida com sucesso.' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao apagar planilha.', error: error.message });
  }
};