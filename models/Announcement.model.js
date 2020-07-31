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
  transitionId: {
    type: [{ type: Schema.Types.ObjectId, ref: "Transition" }],
    true: true,
  },
});

module.exports = model("Announcement", announcementSchema);
