const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Liga-se ao MongoDB usando a URI definida no ficheiro .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Conectado com sucesso: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    // Encerra o processo da aplicação em caso de falha na conexão
    process.exit(1);
  }
};

module.exports = connectDB;