// const express = require('express');
// const router = express.Router();
// const nodemailer = require('nodemailer');

// // Nodemailer transporter ஐ அமைத்தல்
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // payer க்கு email அனுப்பும் Route
// router.post('/sendEmailToPayer', async (req, res) => {
//   const { payerEmail } = req.body;
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: payerEmail,
//     subject: 'Payment Confirmation',
//     text: 'Thank you for your payment. Your transaction was successful!',
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: 'Email sent to payer successfully!' });
//   } catch (error) {
//     console.error('Error sending email to payer:', error);
//     res.status(500).json({ error: 'Failed to send email to payer' });
//   }
// });

// // instructor க்கு email அனுப்பும் Route
// router.post('/sendEmailToInstructor', async (req, res) => {
//   const { instructorEmail } = req.body;
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: instructorEmail,
//     subject: 'New Payment Received',
//     text: 'A new payment has been received for your course!',
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: 'Email sent to instructor successfully!' });
//   } catch (error) {
//     console.error('Error sending email to instructor:', error);
//     res.status(500).json({ error: 'Failed to send email to instructor' });
//   }
// });

// module.exports = router;
