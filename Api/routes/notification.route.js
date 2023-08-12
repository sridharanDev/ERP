const router = require("express").Router();
const notifcationConreoller = require("../controllers/notificationController");

router.post("/",notifcationConreoller.CreateNotificationController);
router.delete("/:id",notifcationConreoller.DeleteNotificationController);
router.get("/",notifcationConreoller.GetNotificationsController);
router.post("/:id",notifcationConreoller.GetNotificationController);

module.exports = router;