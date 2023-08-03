const router = require('express').Router();
const projectCotroller = require('../controllers/projectController');

router.post("/",projectCotroller.CreateProjectCotroller);
router.put("/:id",projectCotroller.EditProjectController);
router.delete("/:id",projectCotroller.DeleteProjectController);
router.get("/",projectCotroller.GetProjectsController);
router.get("/:id",projectCotroller.GetProjectController);

module.exports = router;