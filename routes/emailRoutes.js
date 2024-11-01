// emailRoutes.js
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config(); // Load environment variables from .env file

// Configure the email transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use the email user from .env
    pass: process.env.EMAIL_PASS, // Use the email password from .env
  },
});

// Route to send email to Payer
router.post('/api/send-email/payer', async (req, res) => {
  const { email } = req.body;
  const mailOptions = {
    from: process.env.EMAIL_USER, // Set from address to EMAIL_USER
    to: email,
    subject: 'Payment Received',
    text: 'Your payment has been successfully received.',
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent to payer successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error sending email to payer', error });
  }
});

// Route to send email to Instructor
router.post('/api/send-email/instructor', async (req, res) => {
  const { email } = req.body;
  const mailOptions = {
    from: process.env.EMAIL_USER, // Set from address to EMAIL_USER
    to: email,
    subject: 'Payment Check',
    text: 'Please check your payment.',
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent to instructor successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error sending email to instructor', error });
  }
});

module.exports = router;
