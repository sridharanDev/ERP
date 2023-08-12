const router = require('express').Router();
const TaskCommandController = require("../controllers/taskCommandController");

router.post("/",TaskCommandController.CreateCommandController);
router.put("/:id",TaskCommandController.EditCommandController);
router.delete("/:id",TaskCommandController.DeleteCommandController);
router.get("/",TaskCommandController.GetCommandsController);
router.get("/:id",TaskCommandController.GetCommandController);

module.exports = router;