const express = require('express');
const router = express.Router();
const columnController = require('../controllers/columnController');

// Rotas para Gerenciamento de Colunas
router.get('/sheet/:sheetId', columnController.getColumnsBySheet);
router.post('/', columnController.createColumn);
router.delete('/:id', columnController.deleteColumn);

module.exports = router;