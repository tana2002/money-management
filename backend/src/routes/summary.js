const express = require('express');
const auth = require('../middleware/auth');
const db = require('../db');

const router = express.Router();

// 月別支出合計
router.get('/monthly', auth, async (req, res) => {
    try {
        const [rows] = await db.query(
            `
      SELECT
        DATE_FORMAT(expense_date, '%Y-%m') AS month,
        SUM(amount) AS total
      FROM expenses
      WHERE user_id = ?
      GROUP BY month
      ORDER BY month DESC
      `,
            [req.userId]
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'サーバーエラー' });
    }
});

// カテゴリ別支出合計
router.get('/category', auth, async (req, res) => {
    try {
        const [rows] = await db.query(
            `
      SELECT
        c.name AS category,
        SUM(e.amount) AS total
      FROM expenses e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = ?
      GROUP BY c.name
      ORDER BY total DESC
      `,
            [req.userId]
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'サーバーエラー' });
    }
});

module.exports = router;