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

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

// Conecta ao banco e popula os usuários iniciais no MongoDB
connectDatabase().then(() => {
  seedInitialUsers();
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Registro de Rotas da API
app.use("/api/users", userRoutes);
app.use("/api/sheets", sheetRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/rows", rowRoutes);

console.log("✅ Rotas de usuários, planilhas, colunas e linhas carregadas!");

app.get("/", (req, res) => {
  res.json({
    message: "API SheetHub está funcionando com MongoDB!"
  });
});

app.get("/teste", (req, res) => {
  res.send("Servidor de teste funcionando!");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});