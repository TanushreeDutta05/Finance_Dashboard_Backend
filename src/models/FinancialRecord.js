const mongoose = require('mongoose');


const financialRecordSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required'],
    },

    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be greater than 0'],
    },

    type: {
        type: String,
        enum: {
            values: ['income', 'expense'],
            message: 'Type must be either income or expense',
        },
        required: [true, 'Transaction type is required'],
    },

    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        enum: {
            values: [
                'salary', 'freelance', 'investment', 'gift', 'other_income',
                'food', 'transport', 'utilities', 'rent', 'entertainment',
                'healthcare', 'shopping', 'education', 'other_expense'
            ],
            message: 'Invalid category',
        },
    },

    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters'],
    },

    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
    
    deletedAt: {
        type: Date,
        default: null,
    },

});


financialRecordSchema.index({ user: 1, date: -1 });
financialRecordSchema.index({ user: 1, type: 1, date: -1 });
financialRecordSchema.index({ user: 1, category: 1 });


module.exports = mongoose.model('FinancialRecord', financialRecordSchema);