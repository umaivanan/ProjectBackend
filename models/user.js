// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password_hash: { type: String, required: true },
//     role: { type: String, required: true, enum: ['admin', 'user'], default: 'user' }
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
    isBlocked: { type: Boolean, default: false } // New field for blocking status
});

module.exports = mongoose.model('User', userSchema);
