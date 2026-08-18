import express from 'express';
import rowController from '../controllers/rowController.js';

const router = express.Router();

// Rotas para Gerenciamento de Linhas / Dados
router.get('/sheet/:sheetId', rowController.getRowsBySheet);
router.post('/', rowController.createRow);
router.put('/:id', rowController.updateRow);
router.delete('/:id', rowController.deleteRow);

export default router;