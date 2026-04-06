const User = require('../models/User');


// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        const query = {};

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Filter by role
        if (req.query.role) {
            query.role = req.query.role;
        }

        const users = await User.find(query)
            .limit(limit)
            .skip(startIndex)
            .sort('-createdAt');

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};


// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
const getUser = async (req, res) => {

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};


// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {

    const { name, email, role, status } = req.body;
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.status = status || user.status;
        user.updatedAt = Date.now();

        await user.save();

        res.status(200).json({
            success: true,
            data: user,
            message: 'User updated successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};


// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        user.deletedAt = Date.now();
        user.status = 'inactive';
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};


// @desc    Create user (admin)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {

    const { name, email, password, role, status } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'viewer',
            status: status || 'active',
        });

        res.status(201).json({
            success: true,
            data: user,
            message: 'User created successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};


module.exports = { getUsers, getUser, updateUser, deleteUser, createUser };