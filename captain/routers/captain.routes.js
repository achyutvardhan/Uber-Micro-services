const express = require("express");
const router = express.Router();
const captainController = require("../controllers/captain.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", captainController.register);
router.post("/login", captainController.login);
router.get("/logout", captainController.logout);
router.get("/profile", authMiddleware.authcaptain, captainController.profile);
router.patch("/toggle-availability", authMiddleware.authcaptain, captainController.toggleAvailability);
router.get("/new-ride", authMiddleware.authcaptain ,captainController.getRideRequest);
module.exports = router; // Export router
