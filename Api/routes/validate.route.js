const router = require('express').Router();
const {verifyToken} = require("../utils/tokenVerify")

router.post("/:id",async (req,res,next) =>{
    try
    {
        const token = req.params.id;
        const decoded = verifyToken(token,process.env.JWT_SECRET);
        res.status(200).json(decoded);
    }
    catch(error)
    {
        res.status(500).json(error.message); 
    }
}); 

module.exports = router;

