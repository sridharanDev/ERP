const router = require("express").Router();
const leaveApplicationConreoller = require("../controllers/leaveApplicationController");

router.post("/",leaveApplicationConreoller.CreateLeaveApplicationController);
router.put("/:id",leaveApplicationConreoller.EditLeaveApplicationController);
router.delete("/:id",leaveApplicationConreoller.DeleteLeaveApplicationController);
router.get("/",leaveApplicationConreoller.GetLeaveApplicationsController);
router.get("/:id",leaveApplicationConreoller.GetLeaveApplicationController);

module.exports = router;