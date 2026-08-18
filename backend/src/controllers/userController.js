import User from '../models/User.js';

const userController = {
  // Lista todos os usuários (omitindo a senha por segurança)
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password');
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Busca um usuário por ID (omitindo a senha)
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Cadastro de Usuário (POST /register)
  postUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
      }

      // Verifica se o e-mail já existe no MongoDB
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'E-mail já cadastrado.' });
      }

      const newUser = await User.create({ name, email, password });

      // Omitir a senha antes de enviar a resposta
      const userResponse = newUser.toObject();
      delete userResponse.password;

      return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: userResponse });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  // Autenticação / Login (POST /login)
  postLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
      }

      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
      }

      const userResponse = user.toObject();
      delete userResponse.password;

      return res.status(200).json({ message: 'Login realizado com sucesso!', user: userResponse });
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  },

  // Atualizar dados
  updateUser: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      return res.status(200).json({ message: 'Dados atualizados!', user: updatedUser });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  // Deletar usuário
  deleteUser: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      return res.status(200).json({ message: 'Usuário removido com sucesso.' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
};

export default userController;