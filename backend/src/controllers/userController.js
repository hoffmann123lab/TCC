const User = require('../models/User'); // 🟢 Importando da pasta 'models'

const userController = {
  getAllUsers: (req, res) => {
    try {
      const users = User.findAll();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getUserById: (req, res) => {
    try {
      const user = User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  register: (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
      }
      const newUser = User.create({ name, email, password });
      return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: newUser });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  login: (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
      }
      const user = User.login({ email, password });
      return res.status(200).json({ message: 'Login realizado com sucesso!', user });
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  },

  updateUser: (req, res) => {
    try {
      const updatedUser = User.update(req.params.id, req.body);
      return res.status(200).json({ message: 'Dados atualizados!', user: updatedUser });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  deleteUser: (req, res) => {
    try {
      User.delete(req.params.id);
      return res.status(200).json({ message: 'Usuário removido com sucesso.' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
};

module.exports = userController;