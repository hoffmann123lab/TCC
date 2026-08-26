import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/register', userController.postUser);
router.post('/login', userController.postLogin);
router.get('/', userController.getAllUsers);

// Rotas exclusivas de Admin
router.get('/admin/folders', userController.getUserFolders);
router.put('/admin/users/:id/ban', userController.toggleBanUser);

// Rotas com ID (devem ficar no final)
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;