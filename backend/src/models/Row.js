const mongoose = require('mongoose');

const rowSchema = new mongoose.Schema({
  sheetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sheet',
    required: true,
  },
  // O tipo 'Map' de 'of: String' é a chave do NoSQL:
  // permite armazenar pares dinâmicos { "id_da_coluna": "valor" }
  data: {
    type: Map,
    of: String,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Row', rowSchema);