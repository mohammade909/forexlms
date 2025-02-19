const express = require("express");
const router = express.Router();
const {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  getClassSchedules
} = require("../controllers/scheduleController");
const { getSchedulesByTeacher } = require("../controllers/scheduleController");

// Route to create a new schedule
router.post("/", createSchedule);

// Route to get all schedules
router.get("/", getAllSchedules);

// Route to get a schedule by ID
router.get("/:id", getScheduleById);
router.get("/class/:class_id", getClassSchedules);
router.get("/teacher/:teacherId", getSchedulesByTeacher);
// Route to update a schedule by ID
router.put("/:id", updateSchedule);

// Route to delete a schedule by ID
router.delete("/:id", deleteSchedule);

module.exports = router;
