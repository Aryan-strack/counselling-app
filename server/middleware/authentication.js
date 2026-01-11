const jwt = require("jsonwebtoken");
const client = require("../utils/redisDatabase");

exports.authentication = async (req, res, next) => {
  try {
    // Check if Authorization header is provided
    const token = req.header("Authorization");
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized: Token not provided or malformed",
        success: false,
      });
    }

    // Extract JWT token by removing "Bearer " prefix
    const jwtToken = token.replace("Bearer ", "").trim();
    
    // Verify the token directly (no Redis dependency)
    let decodedToken;
    try {
      decodedToken = jwt.verify(
        jwtToken,
        process.env.JWT_SECRET_KEY
      );
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized: Invalid or expired token",
        success: false,
      });
    }

    if (!decodedToken || !decodedToken.userId) {
      return res.status(401).json({
        message: "Unauthorized: Missing user information in token",
        success: false,
      });
    }

    // Fetch user from database
    const UserSchema = require("../model/User");
    const user = await UserSchema.findById(decodedToken.userId).populate("counselor");
    
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found",
        success: false,
      });
    }

    if (user.status === "disabled") {
      return res.status(403).json({
        message: "Account is disabled",
        success: false,
      });
    }

    // Attach user data to the request object
    req.user = user;
    req.isLoggedIn = decodedToken.isLoggedIn || true;
    req.userId = user._id;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      message: "Unauthorized: Invalid token or session expired",
      success: false,
    });
  }
};
