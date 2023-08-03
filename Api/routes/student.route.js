const router = require('express').Router();
const studentontroller = require("../controllers/studentController");

router.post("/",studentontroller.CreateStudetCotroller);
router.put("/:id",studentontroller.EditStudetCotroller);
router.delete("/:id",studentontroller.DeleteStudetCotroller);
router.get("/",studentontroller.GetStudetsCotroller);
router.get("/:id",studentontroller.GetStudetCotroller);

module.exports = router;