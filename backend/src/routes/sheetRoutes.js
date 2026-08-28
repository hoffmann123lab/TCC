import express from 'express';
import sheetController from '../controllers/sheetController.js';

const router = express.Router();

// GET /api/sheets -> Busca planilhas (com filtro opcional por userId)
router.get('/', sheetController.getSheets);

// POST /api/sheets -> Cria uma nova planilha
router.post('/', sheetController.createSheet);

// POST /api/sheets/:id/comments -> Adiciona um comentário do administrador
router.post('/:id/comments', sheetController.addComment);

// GET /api/sheets/:id -> Busca uma planilha específica pelo ID
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

// PUT /api/sheets/:id -> Atualiza uma planilha existente
router.put('/:id', sheetController.updateSheet);

// DELETE /api/sheets/:id -> Remove uma planilha
router.delete('/:id', sheetController.deleteSheet);

export default router;