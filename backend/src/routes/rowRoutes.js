const express = require('express');
const router = express.Router();
const rowController = require('../controllers/rowController');

// Rotas para Gerenciamento de Linhas / Dados
router.get('/sheet/:sheetId', rowController.getRowsBySheet);
router.post('/', rowController.createRow);
router.put('/:id', rowController.updateRow);
router.delete('/:id', rowController.deleteRow);

module.exports = router;