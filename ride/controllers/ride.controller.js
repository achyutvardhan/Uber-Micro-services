const rideModel = require("../models/ride.model");
const { publishToQueue } = require("../service/rabbit");
module.exports.creatRide = async (req, res, next) => {
  try {
    const { pickup, destination } = req.body;
    const user = req.user._id;
    const ride = new rideModel({
      user: user,
      pickup: pickup,
      destination: destination,
    });

    await ride.save();
    publishToQueue("new-ride", JSON.stringify(ride));

    res.status(201).send(ride);
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports.acceptRideRequest = async (req, res) => {
  const rideId = req.params;
  const ride = await rideModel.findById(rideId);
  if (!ride) {
    return res.status(404).json({ message: "ride not found" });
  } 
  ride.status = "accepted";
  await ride.save();
  publishToQueue("ride-accepted", JSON.stringify(ride));
  res.send(ride);
};
