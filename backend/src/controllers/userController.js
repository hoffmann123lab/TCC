import User from '../models/User.js';
import Sheet from '../models/Sheet.js';

const ADMIN_EMAILS = [
  'rafaelhoffmann@gmail.com',
  'samuelcunha@gmail.com'
];

const userController = {
  // Retorna todos os usuários (Rota usada pela AdminUsersPage)
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password');
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Rota de pastas para o Admin
  getUserFolders: async (req, res) => {
    try {
      const { adminId } = req.query;
      if (!adminId) return res.status(401).json({ message: 'ID do admin necessário.' });

      const adminUser = await User.findById(adminId);
      if (!adminUser) return res.status(404).json({ message: 'Admin não encontrado.' });

      const cleanEmail = adminUser.email ? adminUser.email.toLowerCase().trim() : '';
      if (!ADMIN_EMAILS.includes(cleanEmail)) {
        return res.status(403).json({ message: 'Acesso negado.' });
      }

      const users = await User.find({}, 'name email role isBanned banReason');
      const sheets = await Sheet.find().populate('userId', '_id name email');

      const folders = users.map((user) => {
        const userIdStr = user._id.toString();
        const userSheets = sheets.filter((sheet) => {
          if (!sheet.userId) return false;
          const sheetOwnerId = sheet.userId._id ? sheet.userId._id.toString() : sheet.userId.toString();
          return sheetOwnerId === userIdStr;
        });

        return {
          id: user._id,
          folderName: `Pasta de ${user.name}`,
          owner: user.name,
          email: user.email,
          role: user.role,
          isBanned: user.isBanned || false,
          banReason: user.banReason || '',
          sheets: userSheets
        };
      });

      return res.status(200).json(folders);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar pastas.', error: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  postUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Preencha todos os campos.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const userExists = await User.findOne({ email: cleanEmail });
      
      if (userExists) {
        if (userExists.isBanned) {
          return res.status(403).json({ message: 'Este e-mail está banido do sistema.' });
        }
        return res.status(400).json({ message: 'E-mail já cadastrado.' });
      }

      const role = ADMIN_EMAILS.includes(cleanEmail) ? 'admin' : 'user';
      const newUser = await User.create({ name, email: cleanEmail, password, role });
      const userResponse = newUser.toObject();
      delete userResponse.password;

      return res.status(201).json({ message: 'Usuário criado!', user: userResponse });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  postLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Preencha e-mail e senha.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const user = await User.findOne({ email: cleanEmail });

      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      if (user.isBanned) {
        const reason = user.banReason ? ` Motivo: ${user.banReason}` : '';
        return res.status(403).json({ message: `Sua conta foi banida.${reason}` });
      }

      if (ADMIN_EMAILS.includes(cleanEmail) && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }

      const userResponse = user.toObject();
      delete userResponse.password;

      return res.status(200).json({ message: 'Login efetuado!', user: userResponse });
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  },

  toggleBanUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { isBanned, reason } = req.body;

      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

      if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        return res.status(403).json({ message: 'Não é possível banir um administrador.' });
      }

      user.isBanned = isBanned;
      user.banReason = isBanned ? (reason || 'Banido pelo administrador') : '';
      await user.save();

      return res.status(200).json({ message: 'Status alterado com sucesso!', user });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao alterar banimento.', error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
      return res.status(200).json({ message: 'Atualizado com sucesso!', user: updatedUser });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: 'Usuário removido com sucesso.' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
};

export default userController;