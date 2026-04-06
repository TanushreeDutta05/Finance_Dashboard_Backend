const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
    },

    role: {
        type: String,
        enum: {
            values: ['viewer', 'analyst', 'admin'],
            message: 'Role must be either viewer, analyst, or admin',
        },
        default: 'viewer',
    },

    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },

    lastLogin: {
        type: Date,
        default: null,
    },
    
    deletedAt: {
        type: Date,
        default: null,
    },

});


module.exports = mongoose.model('User', userSchema);