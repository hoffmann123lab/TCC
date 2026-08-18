import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/register', userController.postUser);
router.post('/login', userController.postLogin);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;