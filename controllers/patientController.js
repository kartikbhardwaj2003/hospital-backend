const { models } = require('mongoose');
const Patient = require('../Models/Patient');

// 👉 Add a new patient
exports.createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 👉 Get all patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE patient by patientId
exports.updatePatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const updated = await Patient.findOneAndUpdate(
      { patientId },            // 🔥 use patientId, not _id
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE patient by patientId
exports.deletePatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const deleted = await Patient.findOneAndDelete({ patientId }); // 🔥 again, by patientId

    if (!deleted) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

