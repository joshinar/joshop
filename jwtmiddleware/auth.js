const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // Get the token from header
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ err: "Authorization denied" });
  }

  //   verify the token
  try {
    const decode = jwt.verify(token, config.get("jwtsecret"));
    req.userId = decode.userId;
    next();
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ err: "Authorizatio denied" });
  }
};
