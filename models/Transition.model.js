const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transitionSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    trim: true,
    required: true,
  },
});

module.exports = model("Transition", transitionSchema);
