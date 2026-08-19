import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// 🟢 Esta é a rota que o ManageSheets.jsx chama:
router.get('/admin/folders', userController.getUserFolders);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/register', userController.postUser);
router.post('/login', userController.postLogin);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;