import User from '../models/User.js';
import Sheet from '../models/Sheet.js';

// Lista explícita de e-mails de administradores permitidos
const ADMIN_EMAILS = [
  'rafaelhoffmann@gmail.com',
  'samuelcunha@gmail.com'
];

const userController = {
  // Lista todos os usuários
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password');
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Busca pastas e planilhas agrupadas por usuário (Apenas Administradores Autorizados)
  getUserFolders: async (req, res) => {
    try {
      const { adminId } = req.query;

      if (!adminId) {
        return res.status(401).json({ message: 'Acesso não autorizado. Identificação do administrador necessária.' });
      }

      // Valida se o usuário existe no banco de dados
      const adminUser = await User.findById(adminId);

      if (!adminUser) {
        return res.status(404).json({ message: 'Administrador não encontrado.' });
      }

      const cleanEmail = adminUser.email ? adminUser.email.toLowerCase().trim() : '';

      // Valida se o e-mail está na lista de admins autorizados
      if (!ADMIN_EMAILS.includes(cleanEmail)) {
        return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para acessar esta área.' });
      }

      // Consulta os dados para montagem do painel de gerenciamento
      const users = await User.find({}, 'name email role');
      const sheets = await Sheet.find().populate('userId', '_id name email');

      const folders = users.map((user) => {
        const userIdStr = user._id.toString();

        const userSheets = sheets.filter((sheet) => {
          if (!sheet.userId) return false;
          
          const sheetOwnerId = sheet.userId._id 
            ? sheet.userId._id.toString() 
            : sheet.userId.toString();

          return sheetOwnerId === userIdStr;
        });

        return {
          id: user._id,
          folderName: `Pasta de ${user.name}`,
          owner: user.name,
          email: user.email,
          sheets: userSheets
        };
      });

      return res.status(200).json(folders);
    } catch (error) {
      return res.status(500).json({ 
        message: 'Erro ao buscar pastas dos usuários.', 
        error: error.message 
      });
    }
  },

  // Busca usuário por ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Cadastro de Usuário
  postUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
      }

      const cleanEmail = email.toLowerCase().trim();

      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({ message: 'E-mail já cadastrado.' });
      }

      // Define role de admin se for um dos e-mails permitidos
      const role = ADMIN_EMAILS.includes(cleanEmail) ? 'admin' : 'user';

      const newUser = await User.create({ name, email: cleanEmail, password, role });
      const userResponse = newUser.toObject();
      delete userResponse.password;

      return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: userResponse });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  // Login
  postLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const user = await User.findOne({ email: cleanEmail });

      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
      }

      // Garante que o usuário fique marcado como admin se for um dos e-mails da lista
      if (ADMIN_EMAILS.includes(cleanEmail) && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }

      const userResponse = user.toObject();
      delete userResponse.password;

      return res.status(200).json({ message: 'Login realizado com sucesso!', user: userResponse });
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  },

  // Atualizar usuário
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