import express from 'express';
import Sheet from '../models/Sheet.js';

const router = express.Router();

// 🟢 GET /api/sheets -> Busca APENAS as planilhas do usuário logado
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    // Se o userId não for passado na requisição, retorna array vazio (não lista nada de outros usuários)
    if (!userId) {
      return res.status(200).json([]);
    }

    // Busca no MongoDB apenas as planilhas criadas por esse userId específico
    const sheets = await Sheet.find({ userId: userId }).sort({ createdAt: -1 });

    return res.status(200).json(sheets);
  } catch (error) {
    console.error('Erro ao buscar planilhas do usuário:', error);
    return res.status(500).json({ message: 'Erro interno ao buscar planilhas.', error: error.message });
  }
});

// 🟢 GET /api/sheets/:id -> Busca uma planilha específica pelo ID
router.get('/:id', async (req, res) => {
  try {
    const sheet = await Sheet.findById(req.params.id);
    if (!sheet) {
      return res.status(404).json({ message: 'Planilha não encontrada.' });
    }
    return res.status(200).json(sheet);
  } catch (error) {
    console.error('Erro ao buscar planilha:', error);
    return res.status(500).json({ message: 'Erro ao buscar a planilha.', error: error.message });
  }
});

// 🟢 POST /api/sheets -> Cria e salva uma nova planilha associando ao userId
router.post('/', async (req, res) => {
  try {
    const { title, description, columns, rows, userId } = req.body;

    // Garante que a planilha sempre terá um dono (userId)
    if (!userId) {
      return res.status(400).json({ message: 'O ID do usuário (userId) é obrigatório para salvar a planilha.' });
    }

    const newSheet = new Sheet({
      title: title || 'Sem título',
      description: description || '',
      userId: userId,
      columns: columns || [],
      rows: rows || []
    });

    const savedSheet = await newSheet.save();
    return res.status(201).json(savedSheet);
  } catch (error) {
    console.error('Erro ao salvar planilha:', error);
    return res.status(500).json({ message: 'Erro ao salvar a planilha.', error: error.message });
  }
});

// 🟢 PUT /api/sheets/:id -> Atualiza uma planilha existente
router.put('/:id', async (req, res) => {
  try {
    const { title, description, columns, rows } = req.body;

    const updatedSheet = await Sheet.findByIdAndUpdate(
      req.params.id,
      { title, description, columns, rows },
      { new: true, runValidators: true }
    );

    if (!updatedSheet) {
      return res.status(404).json({ message: 'Planilha não encontrada para atualização.' });
    }

    return res.status(200).json(updatedSheet);
  } catch (error) {
    console.error('Erro ao atualizar planilha:', error);
    return res.status(500).json({ message: 'Erro ao atualizar a planilha.', error: error.message });
  }
});

// 🟢 DELETE /api/sheets/:id -> Remove uma planilha
router.delete('/:id', async (req, res) => {
  try {
    const deletedSheet = await Sheet.findByIdAndDelete(req.params.id);

    if (!deletedSheet) {
      return res.status(404).json({ message: 'Planilha não encontrada para remoção.' });
    }

    return res.status(200).json({ message: 'Planilha removida com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir planilha:', error);
    return res.status(500).json({ message: 'Erro ao excluir a planilha.', error: error.message });
  }
});

export default router;