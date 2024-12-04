const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/profile" , authMiddleware.authUser , userController.profile)


module.exports = router; // Export router
