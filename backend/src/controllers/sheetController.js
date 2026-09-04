import Sheet from '../models/Sheet.js';
import mongoose from 'mongoose';

const sheetController = {
  // Buscar planilhas do usuário ou todas
  getSheets: async (req, res) => {
    try {
      const { userId } = req.query;
      let filter = {};

      if (userId && userId !== 'undefined' && userId !== 'null') {
        if (mongoose.Types.ObjectId.isValid(userId)) {
          filter = { userId: new mongoose.Types.ObjectId(userId) };
        } else {
          filter = { userId };
        }
      }

      const sheets = await Sheet.find(filter)
        .populate('userId', 'name email role')
        .sort({ createdAt: -1 });

      return res.status(200).json(sheets);
    } catch (error) {
      console.error('Erro ao buscar planilhas:', error);
      return res.status(500).json({ message: 'Erro ao buscar planilhas.', error: error.message });
    }
  },

  // Buscar planilha individual por ID
  getSheetById: async (req, res) => {
    try {
      const { id } = req.params;

      // Valida se o ID recebido é um ObjectId hexadecimal válido
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID da planilha é inválido.' });
      }

      const sheet = await Sheet.findById(id);
      if (!sheet) {
        return res.status(404).json({ message: 'Planilha não encontrada.' });
      }
      return res.status(200).json(sheet);
    } catch (error) {
      console.error('Erro ao buscar planilha:', error);
      return res.status(500).json({ message: 'Erro ao buscar a planilha.', error: error.message });
    }
  },

  // Criar uma nova planilha
  createSheet: async (req, res) => {
    try {
      console.log("--> DADOS RECEBIDOS NO POST:", JSON.stringify(req.body, null, 2));

      const { title, description, columns, rows, userId, user } = req.body;
      const ownerId = userId || user?._id || user?.id || user;

      if (!ownerId) {
        return res.status(400).json({ message: 'O ID do usuário (userId) é obrigatório.' });
      }

      const newSheet = new Sheet({
        title: title || 'Sem título',
        description: description || '',
        columns: columns || [],
        rows: rows || [],
        userId: ownerId
      });

      newSheet.markModified('columns');
      newSheet.markModified('rows');

      const savedSheet = await newSheet.save();

      return res.status(201).json(savedSheet);
    } catch (error) {
      console.error('Erro ao criar planilha:', error);
      return res.status(400).json({ message: 'Erro ao criar planilha.', error: error.message });
    }
  },

  // Atualizar planilha existente
  updateSheet: async (req, res) => {
    try {
      console.log("--> DADOS RECEBIDOS NO PUT:", JSON.stringify(req.body, null, 2));
      const { id } = req.params;

      // Evita disparar CastError se a rota PUT receber "new" ou outro ID inválido
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID da planilha é inválido.' });
      }

      const sheet = await Sheet.findById(id);
      if (!sheet) return res.status(404).json({ message: 'Planilha não encontrada.' });

      const { title, description, columns, rows } = req.body;

      if (title !== undefined) sheet.title = title;
      if (description !== undefined) sheet.description = description;
      if (columns !== undefined) {
        sheet.columns = columns;
        sheet.markModified('columns');
      }
      if (rows !== undefined) {
        sheet.rows = rows;
        sheet.markModified('rows');
      }

      const updatedSheet = await sheet.save();

      return res.status(200).json(updatedSheet);
    } catch (error) {
      console.error('Erro ao atualizar planilha:', error);
      return res.status(400).json({ message: 'Erro ao atualizar planilha.', error: error.message });
    }
  },

  // Adicionar comentário na planilha
  addComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { author, text } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID da planilha é inválido.' });
      }

      if (!text || !author) {
        return res.status(400).json({ message: 'Autor e texto são obrigatórios.' });
      }

      const sheet = await Sheet.findById(id);
      if (!sheet) {
        return res.status(404).json({ message: 'Planilha não encontrada.' });
      }

      sheet.comments.push({ author, text });
      await sheet.save();

      return res.status(200).json({ message: 'Comentário adicionado com sucesso!', comments: sheet.comments });
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      return res.status(500).json({ message: 'Erro interno ao adicionar comentário.', error: error.message });
    }
  },

  // Deletar planilha
  deleteSheet: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID da planilha é inválido.' });
      }

      const deleted = await Sheet.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Planilha não encontrada.' });
      return res.status(200).json({ message: 'Planilha removida com sucesso.' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
};

export default sheetController;