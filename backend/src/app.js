const express = require('express');
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);

module.exports = app;