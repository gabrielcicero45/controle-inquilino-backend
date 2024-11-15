const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.log('Erro ao conectar ao MongoDB', err));

    
app.use('/api/auth', authRoutes);
app.use('/api/tenants', authMiddleware, tenantRoutes);


app.listen(5000, () => {
    console.log('Servidor rodando na porta 5000');
});
