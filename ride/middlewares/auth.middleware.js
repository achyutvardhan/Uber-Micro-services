const jwt = require("jsonwebtoken");
const axios = require("axios");
module.exports.authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "user not authenticated" });
    }
    const decrypt = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decrypt);
    const response = await axios.get(`${process.env.USER_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("hello");
    const user = response.data;
    if (!user) {
      return res.status(401).json({ message: "user not authenticated" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "captain not authenticated" });
    }
    const decrypt = jwt.verify(token, process.env.JWT_SECRET);
    const response = await axios.get(`${process.env.USER_URL}/captain/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const captain = response.data;
    if (!captain) {
      return res.status(401).json({ message: "captain not authenticated" });
    }
    req.captain = captain;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
