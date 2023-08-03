const router = require("express").Router();
const invoiceConreoller = require("../controllers/invoiceController");

router.post("/",invoiceConreoller.CreateInvoiceController);
router.put("/:id",invoiceConreoller.EditInvoiceController);
router.delete("/:id",invoiceConreoller.DeleteInvoiceController);
router.get("/",invoiceConreoller.GetInvoicesController);
router.get("/:id",invoiceConreoller.GetInvoiceController);

module.exports = router;