const router = require('express').Router();
const WorklogController = require("../controllers/worklogController");

router.post("/",WorklogController.CreateWorklogController);
router.put("/:id",WorklogController.EditWorklogController);
router.delete("/:id",WorklogController.DeleteWorklogController);
router.get("/",WorklogController.GetWorklogsController);
router.get("/:id",WorklogController.GetWorklogController);

module.exports = router;