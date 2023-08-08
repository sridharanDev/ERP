const router = require('express').Router();
const attendanceController = require("../controllers/attendanceController");

router.post("/",attendanceController.AttendanceController);
// router.get("/",attendanceController.GetAttendanceController);
router.get("/",attendanceController.GetAttendancesController);
router.delete("/:id",attendanceController.DeleteAttendaceController);

module.exports = router;