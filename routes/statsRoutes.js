const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const verifyToken = require("../middleware/auth");

// GET /api/stats/patient-summary
router.get("/patient-summary", verifyToken, async (req, res) => {
  try {
    const patients = await Patient.find();

    const ageGroups = {
      "0-18": 0,
      "19-35": 0,
      "36-60": 0,
      "60+": 0,
    };

    const conditions = {};

    for (const p of patients) {
      const age = p.age;
      if (age <= 18) ageGroups["0-18"]++;
      else if (age <= 35) ageGroups["19-35"]++;
      else if (age <= 60) ageGroups["36-60"]++;
      else ageGroups["60+"]++;

      if (Array.isArray(p.medicalHistory)) {
        p.medicalHistory.forEach((c) => {
          conditions[c] = (conditions[c] || 0) + 1;
        });
      }
    }

    res.json({ ageGroups, conditions });
  } catch (err) {
    console.error("Error in stats route:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

module.exports = router;
