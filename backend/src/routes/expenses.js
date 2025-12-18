const express = require('express');
const auth = require('../middleware/auth');
const db = require('../db');

const router = express.Router();

// 支出登録
router.post('/', auth, async (req, res) => {
    const { amount, category_id, memo, expense_date } = req.body;

    if (!amount || !expense_date) {
        return res.status(400).json({ message: '必須項目が不足しています' });
    }

    try {
        await db.query(
            `INSERT INTO expenses (user_id, category_id, amount, memo, expense_date)
       VALUES (?, ?, ?, ?, ?)`,
            [req.userId, category_id, amount, memo, expense_date]
        );

        res.status(201).json({ message: '支出を登録しました' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラー' });
    }
});

// 支出一覧取得
router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT id, amount, category_id, memo, expense_date
       FROM expenses
       WHERE user_id = ?
       ORDER BY expense_date DESC`,
            [req.userId]
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'サーバーエラー' });
    }
});

// 支出編集
router.put('/:id', auth, async (req, res) => {
    const { amount, category_id, memo, expense_date } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE expenses
       SET amount = ?, category_id = ?, memo = ?, expense_date = ?
       WHERE id = ? AND user_id = ?`,
            [amount, category_id, memo, expense_date, req.params.id, req.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '更新対象がありません' });
        }

        res.json({ message: '更新しました' });
    } catch (err) {
        res.status(500).json({ message: 'サーバーエラー' });
    }
});

// 支出削除
router.delete('/:id', auth, async (req, res) => {
    try {
        const [result] = await db.query(
            `DELETE FROM expenses WHERE id = ? AND user_id = ?`,
            [req.params.id, req.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '削除対象がありません' });
        }

        res.json({ message: '削除しました' });
    } catch (err) {
        res.status(500).json({ message: 'サーバーエラー' });
    }
});

module.exports = router;
