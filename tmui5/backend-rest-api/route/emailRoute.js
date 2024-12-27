const express = require("express");
const router = express.Router();
const { sendEmail } = require("../controller/emailController");

// POST route for sending emails
router.post("/", async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const isSent = await sendEmail({ to, subject, text, html });
    if (isSent) {
      res.status(200).json({ message: "Email sent successfully" });
    } else {
      res.status(500).json({ message: "Failed to send email" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
