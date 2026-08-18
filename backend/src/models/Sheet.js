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
    columns: {
      type: [String],
      default: []
    },
    rows: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Sheet = mongoose.model('Sheet', sheetSchema);

export default Sheet;