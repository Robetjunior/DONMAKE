const { Schema, model } = require('mongoose')

const announcementSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  imgPath: {
    type: String,
  },
  value: {
    type: Number,
  },
  ongId: {
    type: { type: Schema.Types.ObjectId, ref: "Ong" },
  },
  transaction: {
    type: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
  },
});

module.exports = model("Announcement", announcementSchema);
