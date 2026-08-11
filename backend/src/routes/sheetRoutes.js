const express = require('express');
const router = express.Router();
const sheetController = require('../controllers/sheetController');

// Rotas para Gerenciamento de Planilhas
router.get('/', sheetController.getSheets);
router.post('/', sheetController.createSheet);
router.put('/:id', sheetController.updateSheet);
router.delete('/:id', sheetController.deleteSheet);

module.exports = router;