const router = require("express").Router();
const incomeConreoller = require("../controllers/incomeController");

router.post("/",incomeConreoller.CreateIncomeController);
router.put("/:id",incomeConreoller.EditIncomeController);
router.delete("/:id",incomeConreoller.DeleteIncomeController);
router.get("/",incomeConreoller.GetIncomesController);
router.get("/:id",incomeConreoller.GetIncomeController);

module.exports = router;