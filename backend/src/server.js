const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Permite ler o body JSON enviado pelo React

// 🟢 ROTA PARA SALVAR A PLANILHA E EXIBIR ALERTA NO TERMINAL DO BACKEND
app.post('/api/sheets', (req, res) => {
  try {
    const { title, columns, rows } = req.body;

    // 📩 Alerta formatado em verde no terminal
    console.log('\n\x1b[32m%s\x1b[0m', '===========================================');
    console.log('\x1b[32m%s\x1b[0m', '💾 [BACKEND] NOVA PLANILHA SALVA!');
    console.log(`📌 Título: ${title || 'Sem título'}`);
    console.log(`📊 Colunas (${columns?.length || 0}):`, columns ? columns.join(', ') : 'Nenhuma');
    console.log(`📝 Total de Linhas: ${rows?.length || 0}`);
    console.log('\x1b[32m%s\x1b[0m', '===========================================\n');

    // Retorna resposta de sucesso para o frontend
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