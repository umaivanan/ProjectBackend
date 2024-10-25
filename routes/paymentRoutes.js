// const express = require('express');
// const router = express.Router();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Add this line

// const Payment = require('../models/paymentModel');

// // Payment route
// router.post('/', async (req, res) => {
//     const { token, product, payer, payingTo } = req.body;

//     try {
//         // Create a charge using Stripe
//         const charge = await stripe.charges.create({
//             amount: product.price,
//             currency: 'usd',
//             description: product.name,
//             source: token.id,
//         });

//         // Save payment details to MongoDB
//         const newPayment = new Payment({
//             payerEmail: payer,
//             instructorEmail: payingTo,
//             amount: product.price,
//             productName: product.name,
//             stripeId: charge.id, // Stripe charge ID
//         });

//         await newPayment.save();

//         return res.status(200).json({ success: true, message: 'Payment successful', charge });
//     } catch (error) {
//         console.error('Payment error:', error);
//         return res.status(500).json({ success: false, message: 'Payment failed', error });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe Secret Key from .env
const Payment = require('../models/paymentModel');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password (consider using app-specific password)
    }
});
// Payment route
router.post('/', async (req, res) => {
    const { token, product, payer, payingTo } = req.body;

    try {
        // Create a charge using Stripe
        const charge = await stripe.charges.create({
            amount: product.price,
            currency: 'usd',
            description: product.name,
            source: token.id,
        });

        // Split the payment: 20% to admin, 80% to instructor
        const adminPercentage = 20;
        const instructorPercentage = 80;

        const adminAmount = (product.price * adminPercentage) / 100; // Admin gets 20%
        const instructorAmount = (product.price * instructorPercentage) / 100; // Instructor gets 80%

        // Admin Email from .env
        const adminEmail = process.env.ADMIN_EMAIL;

        // Save payment details to MongoDB
        const newPayment = new Payment({
            payerEmail: payer, // Payer's email
            instructorEmail: payingTo, // Instructor's email
            adminEmail: adminEmail, // Admin's email
            adminAmount: adminAmount, // 20% for admin
            instructorAmount: instructorAmount, // 80% for instructor
            totalAmount: product.price, // Total payment amount
            productName: product.name, // Product name
            stripeId: charge.id, // Stripe charge ID
        });

        await newPayment.save();

        return res.status(200).json({ success: true, message: 'Payment successful', charge });
    } catch (error) {
        console.error('Payment error:', error);
        return res.status(500).json({ success: false, message: 'Payment failed', error });
    }
});
// Route to retrieve payment details based on payerEmail or instructorEmail
router.get('/', async (req, res) => {
    const { payerEmail, instructorEmail } = req.query;

    try {
        let query = {};

        // Search by email if provided
        if (payerEmail) query.payerEmail = payerEmail;
        if (instructorEmail) query.instructorEmail = instructorEmail;

        // Find the payment records that match the query
        const payments = await Payment.find(query);

        if (payments.length > 0) {
            return res.status(200).json({ success: true, payments });
        } else {
            return res.status(404).json({ success: false, message: 'No payment records found' });
        }
    } catch (error) {
        console.error('Error fetching payment details:', error);
        return res.status(500).json({ success: false, message: 'Server error', error });
    }
});

module.exports = router;
