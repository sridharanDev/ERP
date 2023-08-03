const router = require('express').Router();
const attendanceController = require("../controllers/attendanceController");

router.post("/",attendanceController.AttendanceController);
router.get("/",attendanceController.GetAttendanceController);

module.exports = router;