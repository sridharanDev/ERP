const router = require('express').Router();
const staffController = require("../controllers/staffController");

router.post("/",staffController.CreateStaffController);
router.put("/:id",staffController.EditStaffController);
router.delete("/:id",staffController.DeleteStaffController);
router.get("/",staffController.GetStaffsController);
router.get("/:id",staffController.GetStaffController);
router.get("/profile/:id",staffController.GetStaffProfileController);
router.post("/login",staffController.StaffLoginController);

module.exports = router;