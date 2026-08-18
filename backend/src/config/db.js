import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function connectDatabase() {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/sheethub';

    await mongoose.connect(mongoURI);
    console.log("✅ Banco de dados conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco:", error);
    process.exit(1);
  }
}

export default connectDatabase;