const express = require("express");
const router = express.Router();
const Patient = require("../Models/Patient");
const verifyToken = require("../middleware/auth");

// ✅ Create new patient
router.post("/", verifyToken, async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.status(201).json({ message: "Patient created successfully", data: newPatient });
  } catch (err) {
    res.status(500).json({ error: "Failed to create patient" });
  }
});

// ✅ Get all patients (with optional search)
router.get("/", verifyToken, async (req, res) => {
  const q = req.query.q || "";
  const regex = new RegExp(q, "i");

  try {
    const patients = await Patient.find({
      $or: [
        { name: regex },
        { patientId: regex },
        { medicalHistory: regex },
      ],
    });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

// ✅ Get single patient by ID (optional)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch patient" });
  }
});

// ✅ Update patient by ID
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Patient not found" });
    res.json({ message: "Patient updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update patient" });
  }
});

// ✅ Delete patient by ID
router.delete("/:id", verifyToken, async (req, res) => {
  console.log("🧨 DELETE request received for ID:", req.params.id);
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Patient not found" });
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Failed to delete patient" });
  }
});

module.exports = router;
