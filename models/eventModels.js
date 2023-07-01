const mongoose = require("mongoose");
const mongoose_sequence = require("mongoose-sequence")(mongoose);

const eventSchema = new mongoose.Schema({
  _id: Number,
  title: { type: String, required: true },
  eventDate: { type: Date, required: true },
  mainSpeaker: { type: mongoose.Types.ObjectId, ref: "speaker" },
  speakersId: [{ type: mongoose.Types.ObjectId, ref: "speaker" }],
  studentsId: [{ type: Number, ref: "students" }],
});
eventSchema.plugin(mongoose_sequence, { id: "eventId" });
module.exports = mongoose.model("events", eventSchema);
