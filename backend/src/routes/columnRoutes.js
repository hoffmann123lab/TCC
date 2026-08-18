import express from 'express';
import columnController from '../controllers/columnController.js';

const router = express.Router();

// Rotas para Gerenciamento de Colunas
router.get('/sheet/:sheetId', columnController.getColumnsBySheet);
router.post('/', columnController.createColumn);
router.delete('/:id', columnController.deleteColumn);

export default router;