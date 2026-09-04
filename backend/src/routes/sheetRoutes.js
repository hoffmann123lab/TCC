import express from 'express';
import sheetController from '../controllers/sheetController.js';

const router = express.Router();

router.get('/', sheetController.getSheets);
router.post('/', sheetController.createSheet);
router.post('/:id/comments', sheetController.addComment);
router.get('/:id', sheetController.getSheetById); // Chama a função do controller!
router.put('/:id', sheetController.updateSheet);
router.delete('/:id', sheetController.deleteSheet);

export default router;