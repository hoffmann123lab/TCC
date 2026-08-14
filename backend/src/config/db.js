const mongoose = require('mongoose');
require('dotenv').config();
import dotenv from 'dotenv';

async function connectDatabase() {
  try {
    // Usa o MONGO_URI do .env OU a URL padrão do MongoDB local
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/sheethub';

    await mongoose.connect(mongoURI);
    console.log("✅ Banco de dados conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco:", error);
    process.exit(1);
  }
}

module.exports = connectDatabase;