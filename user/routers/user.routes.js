const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/profile" , authMiddleware.authUser , userController.profile)
router.get("/accepted-rides", authMiddleware.authUser , userController.acceptedRides)

module.exports = router; // Export router
