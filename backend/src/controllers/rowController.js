const Row = require('../models/Row');

// Buscar todas as linhas de uma planilha específica
exports.getRowsBySheet = async (req, res) => {
  try {
    const rows = await Row.find({ sheetId: req.params.sheetId }).sort({ createdAt: -1 });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar dados da planilha.', error: error.message });
  }
};

// Adicionar uma nova linha com dados dinâmicos
exports.createRow = async (req, res) => {
  try {
    const { sheetId, data } = req.body; // 'data' é um objeto chave-valor { id_da_coluna: "valor" }
    const newRow = await Row.create({ sheetId, data });
    res.status(201).json(newRow);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao inserir linha.', error: error.message });
  }
};

// Atualizar o conteúdo de uma linha existente
exports.updateRow = async (req, res) => {
  try {
    const { data } = req.body;
    const updatedRow = await Row.findByIdAndUpdate(
      req.params.id,
      { data },
      { new: true }
    );
    if (!updatedRow) return res.status(404).json({ message: 'Linha não encontrada.' });
    res.json(updatedRow);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar linha.', error: error.message });
  }
};

// Deletar uma linha
exports.deleteRow = async (req, res) => {
  try {
    const deleted = await Row.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Linha não encontrada.' });
    res.json({ message: 'Linha removida com sucesso.' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao apagar linha.', error: error.message });
  }
};