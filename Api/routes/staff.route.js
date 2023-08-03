const router = require('express').Router();
const staffController = require("../controllers/staffController");

router.post("/",staffController.CreateStaffController);
router.put("/:id",staffController.EditStaffController);
router.delete("/:id",staffController.DeleteStaffController);
router.get("/",staffController.GetStaffsController);
router.get("/:id",staffController.GetStaffController);

module.exports = router;