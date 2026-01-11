const UserSchema = require("../model/User");
const CounselingSession = require("../model/counselingSession"); // Example model
const sendMail = require("../utils/nodeMailer");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getCounselorProfile = async (req, res, next) => {
  try {
    // Find the user by ID and populate both the counselor and counseling references
    const counselorProfile = await UserSchema.findById(req.params.counselorId)
      .populate("counselor") // Populate the counselor field
      .populate("counseling"); // Populate the counseling field

    // Check if the counselor profile exists
    if (!counselorProfile) {
      return res
        .status(404)
        .json({ message: "Counselor not found", success: false });
    }

    // Return the counselor profile data
    return res.status(200).json({
      data: counselorProfile,
      message: "Counselor Found",
      success: true,
    });
  } catch (error) {
    // Return an error message in case of server issues
    return res.status(500).json({ message: "Server error", success: false });
  }
};

exports.postscheduleCounseling = async (req, res) => {
  try {
    const {
      counselorId,
      startDate,
      endDate,
      duration,
      price,
      paymentMethodId,
    } = req.body;


    if (req.user.role === "counselor" || req.user.role === "admin") {
      return res.status(403).json({
        message: `${req.user.role} can't create session`,
        success: false,
      });
    }
    const counselor = await UserSchema.findById(counselorId);
    if (!counselor) {
      return res
        .status(404)
        .json({ message: "counselor not found", success: false });
    }
    // Check if the slot is already booked
    const existingSession = await CounselingSession.findOne({
      counselorId,
      startDate: new Date(startDate).toISOString(),
    });
    // console.log(counselor)

    if (existingSession) {
      return res.status(400).json({
        message: "This slot is already booked",
        success: false,
      });
    }

    // Process payment using Stripe
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Number(price) * 100, // Convert price to number and multiply by 100 for cents
        currency: "usd",
        payment_method: paymentMethodId,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never", // Disable redirect-based payment methods
        },
      });
    } catch (error) {
      console.error("Stripe Payment Error:", error);
      return res.status(400).json({
        message: error.message || "Payment processing failed",
        success: false,
      });
    }

    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        message: "Payment failed",
        success: false,
      });
    }

    // Create a new counseling session
    const session = await CounselingSession.create({
      counselorId,
      studentId: req.user._id, // Assuming the student is logged in
      startDate: new Date(startDate).toISOString(), // Ensure the date is stored as UTC
      endDate: new Date(endDate).toISOString(), // Ensure the date is stored as UTC
      duration,
    });

    await session.save();
    sendMail(counselor.personalInfo.email, "", "counselor");
    sendMail(req.user.personalInfo.email, "", "student");
    return res.status(200).json({
      message: "Counseling session scheduled successfully",
      success: true,
      data: session,
    });
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      message: "Failed to schedule counseling session",
      success: false,
    });
  }
};

exports.getscheduleCounseling = async (req, res, next) => {
  try {
    const counselorId = req.params.counselorId;
    const studentId = req.user._id;
    const isStudentRequest = req.user.role === "student";

    // Define the session query based on the user's role
    const sessionQuery = isStudentRequest
      ? { counselorId, studentId } // Student request, upcoming sessions only
      : {
        counselorId: studentId,
        studentId: counselorId,
      };
    // Counselor request, upcoming sessions only

    // Find the soonest upcoming session after the current UTC date
    const currentUtcDate = new Date().toISOString();
    const counselingSession = await CounselingSession.findOne({
      ...sessionQuery,
      endDate: { $gt: currentUtcDate }, // Check if session has not ended
    }).sort({ startDate: 1 }); // Sort by startDate in ascending order to get the earliest/current session


    // const studentSelectedTime = "20:53"; // Student selects 8:00 PM (24-hour format)
    // const currentTime = new Date(); // Current time

    // // Parse student selected time into a Date object
    // const [hours, minutes] = studentSelectedTime.split(":").map(Number);
    // const startDate = new Date(currentTime); // Initialize startDate with the current date
    // startDate.setHours(hours, minutes, 0, 0); // Set hours and minutes to the selected time

    // // Calculate endDate as 10 minutes after startDate
    // const endDate = new Date(startDate.getTime() + 10 * 60 * 1000);

    // return res.status(200).json({
    //     message: "Counseling session times retrieved successfully",
    //     success: true,
    //     data: {
    //         startDate: startDate.toISOString(),
    //         endDate: endDate.toISOString(),
    //         durationMinutes: 10, // Explicitly return the duration
    //     },
    // });


    if (!counselingSession) {
      return res.status(404).json({
        message: "No latest counseling session found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Latest counseling session",
      data: counselingSession,
      success: true,
    });
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      message: "Failed to get counseling session",
      success: false,
    });
  }
};

exports.getCounselorAvailableSlots = async (req, res) => {
  try {
    const counselorId = req.params.counselorId;

    // Fetch all sessions for the counselor
    const sessions = await CounselingSession.find({ counselorId });

    // Check if no sessions are found
    if (!sessions || sessions.length === 0) {
      return res.status(200).json({
        message: "all session if available",
        success: true,
        data: [],
      });
    }

    // Extract the start dates of all sessions
    const bookedSlots = sessions.map((session) => session.startDate);

    return res.status(200).json({
      message: "Available slots fetched successfully",
      success: true,
      data: bookedSlots,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch available slots",
      success: false,
    });
  }
};
