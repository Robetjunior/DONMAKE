const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

module.exports = mongoose.model("Announcement", announcementSchema);
