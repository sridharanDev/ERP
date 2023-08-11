const router = require('express').Router();
const expenceController = require("../controllers/expenseController");

router.post("/types/",expenceController.CreateTypeController);
router.put("/types/:id",expenceController.EditTypeController);
router.delete("/types/:id",expenceController.DeleteTypeController);
router.get("/types/",expenceController.GetTypesController);
router.get("/types/:id",expenceController.GetTypeController);

router.post("/",expenceController.CreateExpenseController);
router.put("/:id",expenceController.EditExpenseController);
router.delete("/:id",expenceController.DeleteExpenseController);
router.get("/",expenceController.GetExpensesController);
router.get("/:id",expenceController.GetExpenseController);

module.exports = router;