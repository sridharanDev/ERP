const router = require('express').Router();
const multer = require('multer');
const staffController = require("../controllers/staffController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post("/",upload.array("attachments"),staffController.CreateStaffController);
router.put("/:id",upload.array("attachments"),staffController.EditStaffController);
router.delete("/:id",staffController.DeleteStaffController);
router.get("/",staffController.GetStaffsController);
router.get("/:id",staffController.GetStaffController);
router.get("/profile/:id",staffController.GetStaffProfileController);
router.post("/login",staffController.StaffLoginController);

module.exports = router;