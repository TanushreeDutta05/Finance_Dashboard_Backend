const FinancialRecord = require('../models/FinancialRecord');
const mongoose = require('mongoose');


// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {

    try {
        const matchStage = {};

        // Role-based filter
        // Dashboard is system-wide for all roles
        if (req.query.userId && req.user.role === 'admin') {
            matchStage.user = new mongoose.Types.ObjectId(req.query.userId);
        } else if (req.query.userId) {
            matchStage.user = new mongoose.Types.ObjectId(req.query.userId);
        }

        // Date filters
        if (req.query.startDate || req.query.endDate) {
            matchStage.date = {};
            if (req.query.startDate) {
                matchStage.date.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                matchStage.date.$lte = new Date(req.query.endDate);
            }
        }

        const [summaryResult, recentActivity] = await Promise.all([

            // DASHBOARD SUMMARY
            FinancialRecord.aggregate([
                { $match: matchStage },

                {
                    $facet: {
                        totals: [
                            {
                                $group: {
                                    _id: '$type',
                                    totalAmount: { $sum: '$amount' },
                                    count: { $sum: 1 },
                                },
                            },
                        ],

                        categoryBreakdown: [
                            {
                                $group: {
                                    _id: {
                                        category: '$category',
                                        type: '$type',
                                    },
                                    totalAmount: { $sum: '$amount' },
                                },
                            },
                            {
                                $group: {
                                    _id: '$_id.category',
                                    income: {
                                        $sum: {
                                            $cond: [{ $eq: ['$_id.type', 'income'] }, '$totalAmount', 0],
                                        },
                                    },
                                    expense: {
                                        $sum: {
                                            $cond: [{ $eq: ['$_id.type', 'expense'] }, '$totalAmount', 0],
                                        },
                                    },
                                },
                            },
                        ],

                        totalTransactions: [
                            { $count: 'count' },
                        ],
                    },
                },
            ]),

            // RECENT ACTIVITY (last 10)
            FinancialRecord.aggregate([
                { $match: matchStage },
                { $sort: { date: -1 } },
                { $limit: 10 },

                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                { $unwind: '$user' },

                {
                    $project: {
                        amount: 1,
                        type: 1,
                        category: 1,
                        description: 1,
                        date: 1,
                        user: {
                            _id: '$user._id',
                            name: '$user.name',
                        },
                    },
                },
            ]),
        ]);

        // Extract totals
        let totalIncome = 0;
        let totalExpense = 0;

        summaryResult[0]?.totals.forEach(item => {
            if (item._id === 'income') totalIncome = item.totalAmount;
            if (item._id === 'expense') totalExpense = item.totalAmount;
        });

        const netBalance = totalIncome - totalExpense;
        const totalTransactions = summaryResult[0]?.totalTransactions[0]?.count || 0;

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalIncome,
                    totalExpense,
                    netBalance,
                    totalTransactions,
                },
                categoryBreakdown: summaryResult[0]?.categoryBreakdown || [],
                recentActivity,
            },
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};


// @desc    Get monthly trends
// @route   GET /api/dashboard/trends
// @access  Private
const getMonthlyTrends = async (req, res) => {

    try {
        const matchStage = {};

        // Role-based access
        // Dashboard is system-wide for all roles
        if (req.query.userId && req.user.role === 'admin') {
            matchStage.user = new mongoose.Types.ObjectId(req.query.userId);
        } else if (req.query.userId) {
            matchStage.user = new mongoose.Types.ObjectId(req.query.userId);
        }

        // Default last 6 months
        const months = parseInt(req.query.months) || 6;
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        matchStage.date = { $gte: startDate };

        const trends = await FinancialRecord.aggregate([
            { $match: matchStage },

            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                        type: '$type',
                    },
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },

            {
                $group: {
                    _id: {
                        year: '$_id.year',
                        month: '$_id.month',
                    },
                    income: {
                        $sum: {
                            $cond: [{ $eq: ['$_id.type', 'income'] }, '$totalAmount', 0],
                        },
                    },
                    expense: {
                        $sum: {
                            $cond: [{ $eq: ['$_id.type', 'expense'] }, '$totalAmount', 0],
                        },
                    },
                    count: { $sum: '$count' },
                },
            },

            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: '$_id.year' },
                            '-',
                            {
                                $cond: [
                                    { $lt: ['$_id.month', 10] },
                                    { $concat: ['0', { $toString: '$_id.month' }] },
                                    { $toString: '$_id.month' },
                                ],
                            },
                        ],
                    },
                    income: 1,
                    expense: 1,
                    count: 1,
                },
            },

            { $sort: { month: 1 } },
        ]);

        res.status(200).json({
            success: true,
            data: trends,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};


// @desc    Get category insights
// @route   GET /api/dashboard/insights
// @access  Private
const getCategoryInsights = async (req, res) => {

    try {
        const matchStage = {};

        // Dashboard is system-wide for all roles
        if (req.query.userId && req.user.role === 'admin') {
            matchStage.user = new mongoose.Types.ObjectId(req.query.userId);
        } else if (req.query.userId) {
            matchStage.user = new mongoose.Types.ObjectId(req.query.userId);
        }

        const result = await FinancialRecord.aggregate([
            { $match: matchStage },

            {
                $facet: {
                    topExpenseCategories: [
                        { $match: { type: 'expense' } },
                        {
                            $group: {
                                _id: '$category',
                                total: { $sum: '$amount' },
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { total: -1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                _id: 0,
                                category: '$_id',
                                total: 1,
                                count: 1,
                            },
                        },
                    ],

                    topIncomeCategories: [
                        { $match: { type: 'income' } },
                        {
                            $group: {
                                _id: '$category',
                                total: { $sum: '$amount' },
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { total: -1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                _id: 0,
                                category: '$_id',
                                total: 1,
                                count: 1,
                            },
                        },
                    ],
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: result[0],
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};


module.exports = { getDashboardSummary, getMonthlyTrends, getCategoryInsights };