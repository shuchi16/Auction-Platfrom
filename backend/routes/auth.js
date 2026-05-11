const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST: Register a new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if the user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save the new user to the database
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// POST: Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. Compare the password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Generate a JSON Web Token (JWT)
        const token = jwt.sign(
            { userId: user._id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // 4. Send the token and user data to the frontend
        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
});

module.exports = router;