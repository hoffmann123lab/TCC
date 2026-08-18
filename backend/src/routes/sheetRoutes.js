import express from 'express';
import sheetController from '../controllers/sheetController.js';

const router = express.Router();

router.get('/', sheetController.getSheets);
router.post('/', sheetController.createSheet);
router.put('/:id', sheetController.updateSheet);
router.delete('/:id', sheetController.deleteSheet);

export default router;