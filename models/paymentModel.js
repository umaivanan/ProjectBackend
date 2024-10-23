// const mongoose = require('mongoose');

// const PaymentSchema = new mongoose.Schema({
//     payerEmail: {
//         type: String,
//         required: true,
//     },
//     instructorEmail: {
//         type: String,
//         required: true,
//     },
//     amount: {
//         type: Number,
//         required: true,
//     },
//     productName: {
//         type: String,
//         required: true,
//     },
//     stripeId: {
//         type: String,
//         required: true,
//     },
//     date: {
//         type: Date,
//         default: Date.now,
//     },
// });

// module.exports = mongoose.model('Payment', PaymentSchema);


const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    payerEmail: {
        type: String,
        required: true,
    },
    instructorEmail: {
        type: String,
        required: true,
    },
    adminEmail: {
        type: String,
        required: true,
    },
    adminAmount: {  // Amount that goes to the admin (20%)
        type: Number,
        required: true,
    },
    instructorAmount: {  // Amount that goes to the instructor (80%)
        type: Number,
        required: true,
    },
    totalAmount: {  // Total payment amount
        type: Number,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    stripeId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    formDataId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FormData',
        required: false,
      },
});

module.exports = mongoose.model('Payment', PaymentSchema);
