/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Financial analytics & insights (Viewer + Analyst + Admin)
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard financial summary
 *     description: Returns totals, net balance, category breakdown, and recent activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *         description: Filter by user (Admin only)
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Dashboard summary fetched successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get monthly income & expense trends
 *     description: Returns income vs expense trends (default last 6 months)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema: { type: number }
 *         description: Number of months to analyze (default 6)
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *         description: Filter by user (Admin only)
 *     responses:
 *       200:
 *         description: Monthly trends fetched successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/dashboard/insights:
 *   get:
 *     summary: Get category insights
 *     description: Returns top income and expense categories
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *         description: Filter by user (Admin only)
 *     responses:
 *       200:
 *         description: Category insights fetched successfully
 *       500:
 *         description: Server error
 */