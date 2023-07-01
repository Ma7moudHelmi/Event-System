const mongoose = require("mongoose");

const speakerSchema = new mongoose.Schema({
  _id:mongoose.Types.ObjectId,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("speaker", speakerSchema);
