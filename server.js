const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Selection email template
const selectionTemplate = (candidateName, position) => `
Dear ${candidateName},

We are pleased to inform you that you have been selected for the position of ${position}.

Please reply to this email to confirm your acceptance.

Best regards,
HR Team
`;

// Rejection email template
const rejectionTemplate = (candidateName, position) => `
Dear ${candidateName},

Thank you for applying for the position of ${position}.

We regret to inform you that we have decided to move forward with other candidates.

Best regards,
HR Team
`;

// Create email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send email route
app.post("/send-email", async (req, res) => {

    try {

        const {
            candidateName,
            candidateEmail,
            position,
            status
        } = req.body;

        // Validate form data
        if (!candidateName || !candidateEmail || !position || !status) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        let emailContent;

        // Choose the correct template
        if (status === "selected") {

            emailContent = selectionTemplate(
                candidateName,
                position
            );

        } else if (status === "rejected") {

            emailContent = rejectionTemplate(
                candidateName,
                position
            );

        } else {

            return res.status(400).json({
                success: false,
                message: "Invalid candidate status."
            });

        }

        // Email information
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: candidateEmail,
            subject: `Application Update - ${position}`,
            text: emailContent
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Email sent successfully!"
        });

    } catch (error) {

        console.error("Email error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send email. Please check your email configuration."
        });

    }

});


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});