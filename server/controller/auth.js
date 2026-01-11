const jwt = require("jsonwebtoken");
const client = require("../utils/redisDatabase");
const UserSchema = require("../model/User");
const CounselorProfileSchema = require("../model/CounselorProfile");
const deleteFile = require("../utils/fileRemover");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const sendMail = require("../utils/nodeMailer"); // Only for password reset
exports.postLogin = async (req, res) => {
  try {
    const { email, role, password } = req.body; // Destructure the email from req.body
    // Find the user by email
    const user = await UserSchema.findOne({
      "personalInfo.email": email,
      role,
    });

    // If the user does not exist, return an error response
    if (!user) {
      return res
        .status(401)
        .json({ message: `${role} does not exist`, success: false });
    }

    if (user.status === "disabled") {
      return res.status(403).json({ message: "None", success: false });
    }
    // Compare the provided password with the stored password hash
    const isMatch = await bcryptjs.compare(
      password,
      user.personalInfo.password
    );

    // If the password does not match, return an error response
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }
    const { personalInfo } = user;

    // Create JWT token
    const token = jwt.sign(
      {
        name: personalInfo.name,
        email: personalInfo.email,
        userId: user._id,
        role,
        isLoggedIn: true,
      },
      process.env.JWT_SECRET_KEY, // Replace with your secret key
      {
        expiresIn: 259200, // Token expiry time in seconds (3 days)
      }
    );
    // Save session in the database
    const userSession = await client.set(
      token, // Key (token)
      JSON.stringify({ userId: user._id, userData: user, token: token }), // Value (session data)
      "EX", // Option for expiry time
      259200 // Expiry time in seconds (3 days)
    );

    // Check Redis response. For some Redis clients, 'OK' may not be returned.
    if (userSession !== "OK") {
      return res.status(500).json({
        message: "Failed to create user session in Redis",
        success: false,
      });
    }

    // Return success response to React
    return res.status(200).json({
      message: "Login successfully",
      token,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};

exports.postRegister = async (req, res, next) => {
  try {
    // Debug: Log the incoming data
    console.log("Registration request body:", JSON.stringify(req.body, null, 2));
    console.log("Registration files:", req.files);
    
    const registerUserData = req.body.registerUser;
    if (!registerUserData) {
      console.error("registerUserData is missing from req.body");
      return res.status(400).json({ 
        message: "Registration data is missing", 
        success: false 
      });
    }

    console.log("registerUserData:", JSON.stringify(registerUserData, null, 2));
    const { role, personalInfo } = registerUserData;
    
    if (!role) {
      console.error("Role is missing");
      return res.status(400).json({ 
        message: "Role is missing", 
        success: false 
      });
    }
    
    console.log("Role:", role);
    
    if (role === "counselor") {
      const { education, payment } = registerUserData;
      const filePath = req.files?.file?.[0]?.filename;

      // Validate required fields
      if (!personalInfo || !personalInfo.email || !personalInfo.password) {
        if (filePath) deleteFile(filePath);
        return res.status(400).json({ 
          message: "Missing required personal information", 
          success: false 
        });
      }

      if (!education || !payment) {
        if (filePath) deleteFile(filePath);
        return res.status(400).json({ 
          message: "Missing education or payment information", 
          success: false 
        });
      }

      // Check if the user already exists
      const user = await UserSchema.findOne({
        "personalInfo.email": personalInfo.email,
      });

      if (user) {
        if (user.status === "disabled") {
          if (filePath) deleteFile(filePath);
          return res.status(403).json({ message: "None", success: false });
        }
        if (filePath) deleteFile(filePath);
        return res
          .status(409)
          .json({ message: "User already exist", success: false });
      }

      // Hash password
      const bcryptPassword = await bcryptjs.hash(personalInfo.password, 12);
      const hashedPersonalInfo = {
        ...personalInfo,
        password: bcryptPassword,
      };
      //removing 'confirmPassword' from personalInfo
      delete hashedPersonalInfo.confirmPassword;

      // Validate file is provided (required for counselor)
      if (!filePath) {
        return res.status(400).json({ 
          message: "Certificate file is required for counselor registration", 
          success: false 
        });
      }

      // Create counselor profile
      let savedProfile;
      try {
        const counselorProfile = new CounselorProfileSchema({
          education,
          payment,
          file: filePath,
        });
        savedProfile = await counselorProfile.save();
        console.log("Counselor profile saved:", savedProfile._id);
      } catch (profileError) {
        console.error("Error saving counselor profile:", profileError);
        if (filePath) deleteFile(filePath);
        return res.status(500).json({ 
          message: "Failed to save counselor profile: " + profileError.message, 
          success: false 
        });
      }

      // Create user directly
      let newUser;
      try {
        const saveUser = new UserSchema({
          personalInfo: hashedPersonalInfo,
          profile: "dummyImage.png",
          role,
          friends: [],
          counselor: savedProfile._id,
        });
        newUser = await saveUser.save();
        console.log("User saved:", newUser._id);
      } catch (userError) {
        console.error("Error saving user:", userError);
        // Clean up: delete counselor profile if user creation fails
        if (savedProfile) {
          await CounselorProfileSchema.findByIdAndDelete(savedProfile._id);
        }
        if (filePath) deleteFile(filePath);
        return res.status(500).json({ 
          message: "Failed to save user: " + userError.message, 
          success: false 
        });
      }

      // Create JWT token
      const token = jwt.sign(
        {
          name: personalInfo.name,
          email: personalInfo.email,
          userId: newUser._id,
          role,
          isLoggedIn: true,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: 259200, // Token expiry time in seconds (3 days)
        }
      );

      // Save session (optional - not critical for registration)
      try {
        const userSession = await client.set(
          token,
          JSON.stringify({ userId: newUser._id, userData: newUser, token: token }),
          "EX",
          259200
        );
        console.log("Session saved:", userSession);
      } catch (sessionError) {
        console.warn("Session save failed (non-critical):", sessionError);
        // Continue even if session save fails
      }

      return res.status(200).json({
        message: "Registration successful",
        token,
        success: true,
      });
    } else {
      // Student registration
      // Validate required fields
      if (!personalInfo || !personalInfo.email || !personalInfo.password) {
        return res.status(400).json({ 
          message: "Missing required personal information", 
          success: false 
        });
      }

      // Check if the user already exists
      const user = await UserSchema.findOne({
        "personalInfo.email": personalInfo.email,
      });

      if (user) {
        if (user.status === "disabled") {
          return res.status(403).json({ message: "None", success: false });
        }
        return res
          .status(409)
          .json({ message: "User already exist", success: false });
      }

      // Hash password
      const bcryptPassword = await bcryptjs.hash(personalInfo.password, 12);
      const hashedPersonalInfo = {
        ...personalInfo,
        password: bcryptPassword,
      };
      //removing 'confirmPassword' from personalInfo
      delete hashedPersonalInfo.confirmPassword;

      // Create user directly
      let newUser;
      try {
        const saveUser = new UserSchema({
          personalInfo: hashedPersonalInfo,
          role,
          friends: [],
          profile: "dummyImage.png",
        });
        newUser = await saveUser.save();
        console.log("Student user saved:", newUser._id);
      } catch (userError) {
        console.error("Error saving student user:", userError);
        return res.status(500).json({ 
          message: "Failed to save user: " + userError.message, 
          success: false 
        });
      }

      // Create JWT token
      const token = jwt.sign(
        {
          name: personalInfo.name,
          email: personalInfo.email,
          userId: newUser._id,
          role,
          isLoggedIn: true,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: 259200, // Token expiry time in seconds (3 days)
        }
      );

      // Save session (optional - not critical for registration)
      try {
        const userSession = await client.set(
          token,
          JSON.stringify({ userId: newUser._id, userData: newUser, token: token }),
          "EX",
          259200
        );
        console.log("Session saved:", userSession);
      } catch (sessionError) {
        console.warn("Session save failed (non-critical):", sessionError);
        // Continue even if session save fails
      }

      return res.status(200).json({
        message: "Registration successful",
        token,
        success: true,
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error stack:", error.stack);
    // Clean up file if error occurred
    if (req.files?.file?.[0]?.filename) {
      deleteFile(req.files.file[0].filename);
    }
    return res.status(500).json({ 
      message: "Server error: " + (error.message || "Unknown error"), 
      success: false 
    });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { role, personalInfo } = req.user;
    if (!role) {
      return res
        .status(401)
        .json({ message: "User Has No Credentials", success: false });
    }

    if (role === "admin") {
      return res.status(200).json({
        data: req.user,
        message: "User Not Found",
        success: true,
      });
    }

    const userData = await UserSchema.findOne({
      "personalInfo.email": personalInfo.email,
    }).populate("counselor");

    if (!userData) {
      return res
        .status(404)
        .json({ message: `${role} not found`, success: false });
    }

    // If the user is a student, simply return the user data
    if (role === "student") {
      return res.status(200).json({
        data: userData,
        message: "student",
        success: true,
      });
    }

    return res
      .status(200)
      .json({ data: userData, message: "user LoggedIn", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};

exports.postEmailResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const hash = crypto.randomBytes(32);
    const token = hash.toString("hex");
    const user = await UserSchema.findOne({
      "personalInfo.email": email,
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Not Found the User", success: false });
    }

    if (user.status === "disabled") {
      return res.status(403).json({ message: "None", success: false });
    }

    user.Token = token;
    user.TokenExpires = Date.now() + 300000;
    await user.save();
    sendMail(user.personalInfo.email, token, "reset", user._id.toString());
    return res
      .status(200)
      .json({ message: "Check your Email!", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};

exports.postResetPassword = async (req, res, next) => {
  try {
    const { token, password, userId } = req.body;
    const user = await UserSchema.findOneAndUpdate(
      { _id: userId, Token: token, TokenExpires: { $gt: Date.now() } },
      {
        $set: {
          "personalInfo.password": await bcryptjs.hash(password, 12),
          Token: undefined,
          TokenExpires: undefined,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(401).json({
        message: "Token has expired. Please try again.",
        success: false,
      });
    }

    return res
      .status(200)
      .json({ message: "Password Reset Successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};
