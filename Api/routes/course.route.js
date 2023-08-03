const router = require('express').Router();
const courseController = require("../controllers/courseController");

router.post("/",courseController.CreateCourseController);
router.put("/:id",courseController.EditCourseController);
router.delete("/:id",courseController.DeleteCourseController);
router.get("/",courseController.GetCoursesController);
router.get("/:id",courseController.GetCourseController);

module.exports = router;