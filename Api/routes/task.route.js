const router = require('express').Router();
const TaskController = require("../controllers/taskController");

router.post("/",TaskController.CreateTaskController);
router.put("/:id",TaskController.EditTaskController);
router.delete("/:id",TaskController.DeleteTaskController);
router.get("/",TaskController.GetTasksController);
router.get("/:id",TaskController.GetTaskController);

module.exports = router;