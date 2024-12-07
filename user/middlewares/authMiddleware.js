const jwt = require("jsonwebtoken");
const userSchema = require("../models/user.model");
const Blacklist = require("../models/blacklisttoken.model");
module.exports.authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "user not authenticated" });
    }
    const isBlacklisted = await Blacklist.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "user not authenticated" });
    }
    const decrypt = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userSchema.findById(decrypt.id);
    console.log(token);
    if (!user) {
      return res.status(401).json({ message: "user not authenticated" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
