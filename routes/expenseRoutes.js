const express = require('express');
const router = express.Router();

const addExpense = require('../controllers/addExpense');
const getAllExpenses = require('../controllers/getAllExpenses');
const updateExpense = require('../controllers/updateExpense');
const deleteExpense = require('../controllers/deleteExpense');
const getExpenseSummary = require('../controllers/getExpenseSummary');
const getMonthlySummary = require('../controllers/getMonthlySummary');
const authMiddleware = require('../middleware/authMiddleware');

// protect all expense routes with auth middleware
router.use(authMiddleware);

// summary routes
router.get('/summary', authMiddleware, getExpenseSummary);
router.get('/summary/month/:month', authMiddleware, getMonthlySummary);

// expense CRUD routes
router.post('/', authMiddleware, addExpense);
router.get('/', authMiddleware, getAllExpenses);
router.put('/:id', authMiddleware, updateExpense);
router.delete('/:id', authMiddleware, deleteExpense);

module.exports = router;
