const router = require('express').Router();
const expenceController = require("../controllers/expenseController");

router.post("/type/",expenceController.CreateTypeController);
router.put("/type/:id",expenceController.EditTypeController);
router.delete("/type/:id",expenceController.DeleteTypeController);
router.get("/type/",expenceController.GetTypesController);
router.get("/type/:id",expenceController.GetTypeController);

module.exports = router;