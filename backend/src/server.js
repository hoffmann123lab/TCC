import dns from "node:dns";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importações dos seus arquivos locais (lembre-se da extensão .js)
import connectDatabase from './config/db.js';
import userRoutes from './routes/userRoutes.js';

// Configuração do DNS e variáveis de ambiente
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const app = express();

// Conecta ao MongoDB
connectDatabase();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Rotas da API
app.use('/api/users', userRoutes);

// Rota para salvar planilhas
app.post('/api/sheets', (req, res) => {
  try {
    const { title, columns, rows } = req.body;

    console.log('\n\x1b[32m%s\x1b[0m', '===========================================');
    console.log('\x1b[32m%s\x1b[0m', '💾 [BACKEND] NOVA PLANILHA SALVA!');
    console.log(`📌 Título: ${title || 'Sem título'}`);
    console.log(`📊 Colunas (${columns?.length || 0}):`, columns ? columns.join(', ') : 'Nenhuma');
    console.log(`📝 Total de Linhas: ${rows?.length || 0}`);
    console.log('\x1b[32m%s\x1b[0m', '===========================================\n');

    return res.status(201).json({
      message: 'Planilha recebida e salva com sucesso!',
      data: { title, columns, rows }
    });
  } catch (error) {
    console.error('❌ Erro no backend:', error);
    return res.status(500).json({ error: 'Erro interno ao salvar planilha.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend a rodar na porta ${PORT}`);
});