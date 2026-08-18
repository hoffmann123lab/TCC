import mongoose from 'mongoose';

const rowSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sheet',
      required: true
    },
    data: {
      type: Map,
      of: String,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

const Row = mongoose.model('Row', rowSchema);

export default Row;