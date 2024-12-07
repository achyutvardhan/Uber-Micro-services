const captainSchema = require("../models/captain.model");
const BlacklistToken = require("../models/blacklisttoken.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { subscribeToQueue, publishToQueue } = require("../service/rabbit");

const PendingRequest = [];

module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const captain = await captainSchema.findOne({ email: email });
    if (captain) {
      return res.status(400).json({ message: "captain already excist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newcaptain = new captainSchema({
      name,
      email,
      password: hashPassword,
    });
    await newcaptain.save();

    const token = jwt.sign({ id: newcaptain._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.status(201).send({ message: "captain created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const captain = await captainSchema
      .findOne({ email: email })
      .select("+password");

    if (!captain) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, captain.password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.send({ message: "captain logged in successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "captain already logged out" });
    }
    await BlacklistToken.create({ token });
    res.clearCookie("token");
    res.send({ message: "captain logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.profile = async (req, res) => {
  try {
    res.send(req.captain);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.toggleAvailability = async (req, res) => {
  try {
    const captain = await captainSchema.findById(req.captain._id);
    captain.isAvailable = !captain.isAvailable;
    await captain.save();
    res.send(captain);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getRideRequest = async (req, res) => {
  try {
    req.setTimeout(30000, () => {
      res.status(204).end();
    });

    PendingRequest.push(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


subscribeToQueue("new-ride", async (data) => {
  const rideData = JSON.parse(data);

  PendingRequest.forEach((res) => {
    res.json(rideData);
  });
  PendingRequest.length = 0;
});
