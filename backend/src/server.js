const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Configuração da base de dados (dentro de src/config)
const connectDB = require('./src/config/db');

// Rotas da API (dentro de src/routes)
const sheetRoutes = require('./src/routes/sheetRoutes');
const columnRoutes = require('./src/routes/columnRoutes');
const rowRoutes = require('./src/routes/rowRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Liga ao MongoDB Atlas
connectDB();

// Uso das Rotas
app.use('/api/sheets', sheetRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/rows', rowRoutes);

// Rota inicial de teste
app.get('/', (req, res) => {
  res.send('API do SheetMaker rodando com sucesso!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});