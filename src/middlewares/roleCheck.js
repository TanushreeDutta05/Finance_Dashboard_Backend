const roleCheck = (...roles) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. ${req.user.role} role does not have permission for this action`,
            });
        }

        next();

    };

};


// Helper middleware for record ownership
const checkRecordOwnership = async (req, res, next) => {

    const FinancialRecord = require('../models/FinancialRecord');

    try {
        const record = await FinancialRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Record not found',
            });
        }

        // Admin can access any record, others only their own
        if (req.user.role !== 'admin' && record.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only access your own records',
            });
        }

        req.record = record;
        next();
    } catch (error) {
        next(error);
    }

};


module.exports = { roleCheck, checkRecordOwnership };