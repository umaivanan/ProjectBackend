const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();


// Register

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        
        // If the user exists and is blocked, prevent registration
        if (existingUser && existingUser.isBlocked) {
            return res.status(403).json({ error: 'This account is blocked. Registration with this email is not allowed.' });
        }

        // If the user exists but is not blocked, return an error for existing account
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the hashed password
        const newUser = new User({
            name,
            email,
            password_hash: hashedPassword,
            role: role || 'user' // Default role is 'user' unless specified
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return token and user role in the response
        res.status(201).json({ message: 'User registered', token, role: newUser.role });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        // Check if the user is blocked
        if (user.isBlocked) {
            return res.status(403).json({ error: 'User is blocked. Please contact support.' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Check if credentials match the admin credentials (for admin login)
        const isAdmin = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, role: isAdmin ? 'admin' : user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return token and role in the response
        res.json({ token, role: isAdmin ? 'admin' : user.role });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ error: 'User not found' }); // இது 404 பதில் அளிக்கும்
  
      res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

// Update User by ID
// router.put('/:id', async (req, res) => {
//     const { id } = req.params;
//     const { name, email, password, role } = req.body;

//     try {
//         const user = await User.findById(id);
//         if (!user) return res.status(404).json({ error: 'User not found' });

//         // Update password if provided
//         if (password) {
//             user.password_hash = await bcrypt.hash(password, 10);
//         }

//         // Update other fields if provided
//         if (name) user.name = name;
//         if (email) user.email = email;
//         if (role) user.role = role;

//         await user.save();
//         res.json({ message: 'User updated', user });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });
// Update User's Block Status
router.put('/admin/users/:id/block', async (req, res) => {
    const { id } = req.params;
    const { isBlocked } = req.body; // Expecting a boolean to set the blocked status

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Update the user's blocked status
        user.isBlocked = isBlocked;
        await user.save();

        res.json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'}`, user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// Delete User by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all users (Admin only)
router.get('/admin/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch users' });
    }
});

// router.patch('/admin/blockUser/:id', verifyAdmin, async (req, res) => {
//     const { id } = req.params;

//     try {
//         const user = await User.findById(id);
//         if (!user) return res.status(404).json({ error: 'User not found' });

//         user.status = 'blocked';
//         await user.save();

//         res.json({ message: 'User has been blocked', user });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

router.get('/test', async (req, res) => {
    try {
      const users = await User.find();
      // res.status(200).json(users);
      res.send('<h1>TEST  Successfully</h1>')
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  });

module.exports = router;