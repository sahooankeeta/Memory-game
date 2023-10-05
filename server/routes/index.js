const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.get("/",(req,res)=>{
    res.send("welcome")
    })
module.exports = router;