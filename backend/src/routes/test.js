const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/protected', auth, (req, res) => {
    res.json({
        message: '認証成功',
        userId: req.userId
    });
});

module.exports = router;
