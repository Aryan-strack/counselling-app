const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./model/User"); // Adjust path if needed
const CounselorProfile = require("./model/CounselorProfile"); // Adjust path if needed

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_STRING)
    .then(() => {
        console.log("✅ MongoDB Connected for Seeding");
        seedDatabase();
    })
    .catch((err) => {
        console.error("❌ DB Connection Error:", err);
        process.exit(1);
    });

const seedDatabase = async () => {
    try {
        // Clear existing data (Optional: comment out if you want to keep existing data)
        // await User.deleteMany({});
        // await CounselorProfile.deleteMany({});
        // console.log("🧹 Cleared existing users and profiles");

        const password = await bcrypt.hash("123456", 12);

        // 1. Create Admin
        const adminExists = await User.findOne({ "personalInfo.email": "admin@example.com" });
        if (!adminExists) {
            await User.create({
                personalInfo: {
                    name: "Super Admin",
                    email: "admin@example.com",
                    password: password,
                },
                role: "admin",
                status: "active",
                profile: "default-admin.png", // Ensure this exists or handle missing image
            });
            console.log("👤 Admin created: admin@example.com / 123456");
        } else {
            console.log("⚠️ Admin already exists");
        }

        // 2. Create Student
        const studentExists = await User.findOne({ "personalInfo.email": "student@example.com" });
        if (!studentExists) {
            await User.create({
                personalInfo: {
                    name: "John Student",
                    email: "student@example.com",
                    password: password,
                },
                role: "student",
                status: "active",
                profile: "default-student.png",
            });
            console.log("🎓 Student created: student@example.com / 123456");
        } else {
            console.log("⚠️ Student already exists");
        }


        // 3. Create Counselor with Profile
        const counselorExists = await User.findOne({ "personalInfo.email": "counselor@example.com" });
        if (!counselorExists) {
            // Create Profile first
            const counselorProfile = await CounselorProfile.create({
                education: {
                    degree: "PhD in Psychology",
                    institution: "Harvard University",
                    experience: "10 Years",
                    description: "Expert in clinical psychology and student counseling.",
                },
                payment: {
                    accountNumber: "1234567890",
                    bankName: "Test Bank",
                    branchCode: "001",
                },
                file: "verification-doc.pdf", // Dummy file
            });

            // Create User linked to Profile
            await User.create({
                personalInfo: {
                    name: "Dr. Sarah Expert",
                    email: "counselor@example.com",
                    password: password,
                },
                role: "counselor",
                status: "active",
                profile: "default-counselor.png",
                counselor: counselorProfile._id, // Link to profile
            });
            console.log("🧠 Counselor created: counselor@example.com / 123456");
        } else {
            console.log("⚠️ Counselor already exists");
        }

        console.log("✅ Seeding Complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};
