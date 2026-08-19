import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/register', userController.postUser);
router.post('/login', userController.postLogin);
router.get('/', userController.getAllUsers);

// 🟢 Rota para buscar pastas e planilhas agrupadas por usuário
router.get('/admin/folders', userController.getUserFolders);

router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;