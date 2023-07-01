const mongoose = require("mongoose");
const mongoose_sequence = require("mongoose-sequence")(mongoose);

const studentSchema = new mongoose.Schema({
  _id: Number,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
});
studentSchema.plugin(mongoose_sequence, { id: "studentId" });
module.exports = mongoose.model("students", studentSchema);
