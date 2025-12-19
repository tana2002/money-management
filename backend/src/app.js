const express = require('express');
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test');
const expenseRoutes = require('./routes/expenses');
const summaryRoutes = require('./routes/summary');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/summary', summaryRoutes)

module.exports = app;