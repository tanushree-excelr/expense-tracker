require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const setupSwagger = require('./swagger');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/', (req, res) => {
  res.send('Expense Tracker API is running');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});
