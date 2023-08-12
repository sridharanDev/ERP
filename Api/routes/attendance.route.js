const router = require('express').Router();
const attendanceController = require("../controllers/attendanceController");

router.post("/",attendanceController.AttendanceController);
router.get("/",attendanceController.GetAttendancesController);
router.get("/staff/:id",attendanceController.GetAttendanceController);
router.delete("/:id",attendanceController.DeleteAttendaceController);

module.exports = router;