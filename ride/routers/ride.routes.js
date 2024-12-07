const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const ride = require("../controllers/ride.controller");
router.post("/create-ride", authMiddleware.authUser,ride.creatRide);
router.put("/accept-ride", authMiddleware.authCaptain,ride.acceptRideRequest);
module.exports = router; // Export router
