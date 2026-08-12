const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Banco de dados conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco:", error);
    process.exit(1);
  }
}

module.exports = connectDatabase;