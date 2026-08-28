import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

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
      type: mongoose.Schema.Types.Mixed,
      default: []
    },
    rows: {
      type: mongoose.Schema.Types.Mixed,
      default: []
    },
    comments: [commentSchema]
  },
  {
    timestamps: true
  }
);

const Sheet = mongoose.models.Sheet || mongoose.model('Sheet', sheetSchema);

export default Sheet;