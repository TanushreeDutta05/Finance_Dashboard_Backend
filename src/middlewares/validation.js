const { body, query, validationResult } = require('express-validator');


const validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
            })),
        });
    }

    next();

};


// User validation 
const userValidation = {

    register: [
        body('name').trim().notEmpty().withMessage('Name is required')
            .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
        body('email').isEmail().withMessage('Please provide a valid email')
            .normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('role').optional().isIn(['viewer', 'analyst', 'admin']).withMessage('Invalid role'),
    ],

    update: [
        body('name').optional().trim().isLength({ min: 2 }),
        body('email').optional().isEmail().normalizeEmail(),
        body('role').optional().isIn(['viewer', 'analyst', 'admin']),
        body('status').optional().isIn(['active', 'inactive']),
    ],

};


// Financial record validation
const recordValidation = {

    create: [
        body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
        body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
        body('category').notEmpty().withMessage('Category is required'),
        body('description').optional().isLength({ max: 200 }),
        body('date').optional().isISO8601().toDate(),
    ],

    update: [
        body('amount').optional().isFloat({ min: 0.01 }),
        body('type').optional().isIn(['income', 'expense']),
        body('category').optional().notEmpty(),
        body('description').optional().isLength({ max: 200 }),
        body('date').optional().isISO8601().toDate(),
    ],

    filter: [
        query('type').optional().isIn(['income', 'expense']),
        query('category').optional().isString(),
        query('startDate').optional().isISO8601(),
        query('endDate').optional().isISO8601(),
        query('page').optional().isInt({ min: 1 }).toInt(),
        query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    ],

};


module.exports = { validate, userValidation, recordValidation };