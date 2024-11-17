const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const cors = require('cors');
const connectDB = require('./config/database');

dotenv.config();

const app = express();
connectDB();
app.use(express.json());
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/tenants', authMiddleware, tenantRoutes);


const server = app.listen(5000, () => {
    console.log('Servidor rodando na porta 5000');
  });

module.exports = server;
