const FinancialRecord = require('../models/FinancialRecord');


// @desc    Create financial record
// @route   POST /api/records
// @access  Private (Admin)
const createRecord = async (req, res) => {

    const { amount, type, category, description, date } = req.body;
    try {
        const record = await FinancialRecord.create({
            user: req.user.id,
            amount,
            type,
            category,
            description,
            date: date || Date.now(),
        });

        res.status(201).json({
            success: true,
            data: record,
            message: 'Record created successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};


// @desc    Get all records with filtering and pagination
// @route   GET /api/records
// @access  Private (Analyst, Admin)
const getRecords = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const recordMatch = {};
        const userMatch = {};

        /* =======================
           ROLE BASED ACCESS
        ======================= */

        // ADMIN → can filter by any user
        if (req.user.role === "admin" && req.query.userId) {
            recordMatch.user = new mongoose.Types.ObjectId(req.query.userId);
        }

        // ANALYST / VIEWER → only admin-created records
        if (req.user.role === "analyst" || req.user.role === "viewer") {
            userMatch.role = "admin";
        }

        /* =======================
           RECORD FILTERS
        ======================= */

        if (req.query.type) recordMatch.type = req.query.type;
        if (req.query.category) recordMatch.category = req.query.category;

        if (req.query.startDate || req.query.endDate) {
            recordMatch.date = {};
            if (req.query.startDate)
                recordMatch.date.$gte = new Date(req.query.startDate);
            if (req.query.endDate)
                recordMatch.date.$lte = new Date(req.query.endDate);
        }

        if (req.query.search) {
            recordMatch.description = {
                $regex: req.query.search,
                $options: "i",
            };
        }

        /* =======================
           AGGREGATION
        ======================= */

        const result = await FinancialRecord.aggregate([
            { $match: recordMatch },

            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },

            { $unwind: "$user" },

            // MATCH ON USER AFTER LOOKUP
            Object.keys(userMatch).length ? { $match: { "user.role": "admin" } } : null,

            {
                $project: {
                    amount: 1,
                    type: 1,
                    category: 1,
                    description: 1,
                    date: 1,
                    createdAt: 1,
                    user: {
                        _id: "$user._id",
                        name: "$user.name",
                        email: "$user.email",
                        role: "$user.role",
                    },
                },
            },

            { $sort: { date: -1 } },

            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }],
                },
            },
        ].filter(Boolean)); // removes null stage

        const records = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;

        res.status(200).json({
            success: true,
            data: records,
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


// @desc    Get single record
// @route   GET /api/records/:id
// @access  Private (Analyst, Admin)
const getRecord = async (req, res) => {

    try {
        res.status(200).json({
            success: true,
            data: req.record,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};


// @desc    Update record
// @route   PUT /api/records/:id
// @access  Private (Admin with ownership)
const updateRecord = async (req, res) => {

    const { amount, type, category, description, date } = req.body;
    try {
        const record = req.record;

        record.amount = amount || record.amount;
        record.type = type || record.type;
        record.category = category || record.category;
        record.description = description || record.description;
        record.date = date || record.date;
        record.updatedAt = Date.now();

        await record.save();

        res.status(200).json({
            success: true,
            data: record,
            message: 'Record updated successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};


// @desc    Delete record (soft delete)
// @route   DELETE /api/records/:id
// @access  Private (Admin with ownership)
const deleteRecord = async (req, res) => {

    try {
        const record = req.record;

        record.deletedAt = Date.now();
        await record.save();

        res.status(200).json({
            success: true,
            message: 'Record deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};


module.exports = { createRecord, getRecords, getRecord, updateRecord, deleteRecord };