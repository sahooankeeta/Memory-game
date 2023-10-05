const express = require("express");
const router = express.Router();
const userController=require("../controllers/user_controller")

router.post("/signup",userController.signUp)
router.post("/login",userController.signIn)
router.post("/reset-password",userController.resetPassword)
module.exports = router;