const router = require("express").Router();
const scheduleConreoller = require("../controllers/projectScheduleController");

router.post("/",scheduleConreoller.CreateScheduleController);
router.put("/:id",scheduleConreoller.EditScheduleController);
router.delete("/:id",scheduleConreoller.DeleteScheduleController);
router.get("/",scheduleConreoller.GetSchedulesController);
router.get("/:id",scheduleConreoller.GetScheduleController);

module.exports = router;