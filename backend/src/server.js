import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns";
import connectDatabase from "./config/db.js";

// Importação das Rotas
import userRoutes from "./routes/userRoutes.js";
import sheetRoutes from "./routes/sheetRoutes.js";
import columnRoutes from "./routes/columnRoutes.js";
import rowRoutes from "./routes/rowRoutes.js";

import { seedInitialUsers } from "./models/User.js";

// Configurações Globais e Variáveis de Ambiente
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração Flexível do CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (como Postman) ou da lista permitida
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Conecta ao banco de dados e inicializa dados padrão
connectDatabase()
  .then(() => {
    console.log("🟢 Conexão com MongoDB realizada com sucesso!");
    if (typeof seedInitialUsers === "function") {
      seedInitialUsers();
    }
  })
  .catch((err) => {
    console.error("🔴 Erro crítico ao conectar no MongoDB:", err.message);
  });

// Registro das Rotas da API
app.use("/api/users", userRoutes);
app.use("/api/sheets", sheetRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/rows", rowRoutes);

console.log("✅ Rotas de usuários, planilhas, colunas e linhas carregadas!");

// Rotas de Teste e Healthcheck
app.get("/", (req, res) => {
  res.json({
    message: "API SheetHub está funcionando com MongoDB!",
  });
});

app.get("/teste", (req, res) => {
  res.send("Servidor de teste funcionando!");
});

// Middleware Global de Erros
app.use((err, req, res, next) => {
  console.error("❌ Erro interno no servidor:", err.stack);
  res.status(500).json({
    message: "Ocorreu um erro interno no servidor.",
    error: err.message,
  });
});

// Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});