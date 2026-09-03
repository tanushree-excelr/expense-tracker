const express = require('express');
const router = express.Router();

const addExpense = require('../controllers/addExpense');
const getAllExpenses = require('../controllers/getAllExpenses');
const updateExpense = require('../controllers/updateExpense');
const deleteExpense = require('../controllers/deleteExpense');
const getExpenseSummary = require('../controllers/getExpenseSummary');
const getMonthlySummary = require('../controllers/getMonthlySummary');

router.get('/summary', getExpenseSummary);
router.get('/summary/month/:month', getMonthlySummary);

router.post('/', addExpense);
router.get('/', getAllExpenses);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
