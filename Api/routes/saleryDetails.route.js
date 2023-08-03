const router = require('express').Router();
const csvUploadMiddleware = require('../middlewares/csvUpload');
const salaryController = require("../controllers/salaryController");

router.post("/",salaryController.CreateSaleryController);
router.put("/:id",salaryController.EditSaleryController);
router.delete("/:id",salaryController.DeleteSaleryController);
router.get("/",salaryController.GetSaleriesController);
router.get("/:id",salaryController.GetSalaryController);
router.post('/upload', csvUploadMiddleware,salaryController.UploadSalaryController);

module.exports = router;