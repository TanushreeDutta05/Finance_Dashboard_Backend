const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {

    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'viewer',
        });

        res.status(201).json({ success: true, message: "Registered successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }

};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (user.status !== 'active') {
            return res.status(401).json({ message: 'Account is inactive. Please contact administrator.' });
        }

        user.lastLogin = Date.now();
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }

};


// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {

    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }

};


module.exports = { register, login, getMe };