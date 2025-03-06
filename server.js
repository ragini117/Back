const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const frontendURL = "https://portfolio-kappa-nine-87.vercel.app";

// Middleware
app.use(cors({
    origin: frontendURL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
}));
app.use(bodyParser.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD, // Ensure App Password is used if 2FA is enabled
    },
});

// Handle contact form submission
app.post("/send", async (req, res) => {
    const { name, email, subject, message } = req.body;

    const mailOptions = {
        from: email,
        to: process.env.EMAIL,
        subject: subject || `New Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error("❌ Email not sent:", error);
        res.status(500).json({ success: false, message: "Failed to send message." });
    }
});

// Test API Endpoint
app.get("/api/data", (req, res) => {
    res.json({ message: "Hello from Backend!", data: [1, 2, 3] });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
