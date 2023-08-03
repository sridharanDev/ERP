const router = require('express').Router();
const roleController = require("../controllers/staffRoleController");

router.post("/",roleController.CreateRoleController);
router.put("/:id",roleController.EditRoleController);
router.delete("/:id",roleController.DeleteRoleController);
router.get("/",roleController.GetRolesController);
router.get("/:id",roleController.GetRoleController);

module.exports = router;