const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  sheetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sheet',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['text', 'number', 'date', 'select'],
    default: 'text',
  },
  order: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Column', columnSchema);