const router = require('express').Router();
const adminController = require('../controllers/adminController'); 

router.post("/roles/",adminController.createAdminRoleController);
router.put("/roles/:id",adminController.editAdminRoleController);
router.delete("/roles/:id",adminController.deleteAdminRoleController);
router.get("/roles/",adminController.getAdminRolesController);
router.get("/roles/:id",adminController.getAdminRoleController);

router.post("/",adminController.CreateAdminUserController);
router.put("/:id",adminController.EditAdminUserController);
router.delete("/:id",adminController.DeleteAdminUserController);
router.get("/",adminController.GetAdminUsersController);
router.get("/:id",adminController.GetAdminUserController);

router.post("/login",adminController.adminLoginController);
router.post("/logout",adminController.adminLogoutController);
router.post("/profile",adminController.GetAdminUserProfileController);

module.exports = router;