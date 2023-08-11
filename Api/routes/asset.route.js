const router = require('express').Router();
const assetController = require("../controllers/assetController");

router.post("/types/",assetController.CreateTypeController);
router.put("/types/:id",assetController.EditTypeController);
router.delete("/types/:id",assetController.DeleteTypeController);
router.get("/types/",assetController.GetTypesController);
router.get("/types/:id",assetController.GetTypeController);

router.post("/",assetController.CreateAssetController);
router.put("/:id",assetController.EditAssetController);
router.delete("/:id",assetController.DeleteAssetController);
router.get("/",assetController.GetAssetsController);
router.get("/:id",assetController.GetAssetController);

module.exports = router;