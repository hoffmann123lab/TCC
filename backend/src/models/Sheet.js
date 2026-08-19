import mongoose from 'mongoose';

const sheetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Sem título'
    },
    description: {
      type: String,
      default: ''
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // 🟢 Tipagem Mixed permite salvar tanto Strings quanto Objetos sem dar erro no Mongoose
    columns: {
      type: mongoose.Schema.Types.Mixed,
      default: []
    },
    rows: {
      type: mongoose.Schema.Types.Mixed,
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Sheet = mongoose.models.Sheet || mongoose.model('Sheet', sheetSchema);

export default Sheet;