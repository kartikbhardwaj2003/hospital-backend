const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: Number,
  gender: String,
  contactInfo: {
    phone: { type: String, match: /^[0-9]{10}$/ },
    email: { type: String, match: /.+\@.+\..+/ },
  },
  allergies: [String],
  medicalHistory: [String],
  prescriptions: [
    {
      medication: String,
      dosage: String,
      frequency: String,
    },
  ],
  doctorNotes: [String],
  appointments: [
    {
      date: String,
      reason: String,
    },
  ],
});

module.exports = mongoose.model("Patient", patientSchema);
