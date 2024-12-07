const userSchema = require("../models/user.model");
const BlacklistToken = require("../models/blacklisttoken.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { subscribeToQueue } = require("../service/rabbit");
const EventEmitter = require('events');
const rideEventEmitter = new EventEmitter();

module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userSchema.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "user already excist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new userSchema({
      name,
      email,
      password: hashPassword,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.status(201).send({ message: "user created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email: email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.send({ message: "User logged in successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "user already logged out" });
    }
    await BlacklistToken.create({ token });
    res.clearCookie("token");
    res.send({ message: "user logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.profile = async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.acceptedRides = async (req, res) => {
  try {
    rideEventEmitter.once("ride-accepted", async (data) => {
      res.send(data);
    });

    setTimeout(() => {
      res.status(404).send();
    }, 30000);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

subscribeToQueue("ride-accepted", async (msg) => {
  const data = JSON.parse(msg);
  rideEventEmitter.emit("ride-accepted", data);
});
