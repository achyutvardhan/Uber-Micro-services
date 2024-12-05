const jwt = require("jsonwebtoken");
const captainSchema = require("../models/captain.model");
const Blacklist = require("../models/blacklisttoken.model");
module.exports.authcaptain = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "captain not authenticated" });
    }
    const isBlacklisted = await Blacklist.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "captain not authenticated" });
    }
    const decrypt = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainSchema.findById(decrypt.id);
    if (!captain) {
      return res.status(401).json({ message: "captain not authenticated" });
    }
    req.captain = captain;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
