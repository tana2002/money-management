const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { login_id, password } = req.body;

  if (!login_id || !password) {
    return res.status(400).json({ message: 'loginIDとpasswordは必須です' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users ( login_id, password) VALUES (?,?)',
      [login_id, hashedPassword]
    );
    res.status(201).json({ message: 'ユーザー登録が完了しました' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'すでに登録されています' });
    }
    console.error(err)
    res.status(500).json({ message: 'サーバーエラー' });
  }
});

router.post('/login', async (req, res) => {
  const { login_id, password } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE login_id = ?',
      [login_id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: '認証失敗' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: '認証失敗' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'サーバーエラー' });
  }
});

router.post('/guest-login', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, login_id FROM users WHERE login_id = ? LIMIT 1',
      ['guest']
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'ゲストユーザーが存在しません' });
    }

    const guest = rows[0];

    // JWT発行（guest識別を含める）
    const token = jwt.sign(
      {
        userId: guest.id,
        login_id: guest.login_id, // ← guest判定に使う
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.json({
      token,
      user: {
        id: guest.id,
        login_id: guest.login_id,
        is_guest: true,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
});

module.exports = router;