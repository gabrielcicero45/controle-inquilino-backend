const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/test')
        .then(() => console.log('Conectado ao MongoDB'))
        .catch((err) => console.log('Erro ao conectar ao MongoDB', err));
};

module.exports = connectDB;