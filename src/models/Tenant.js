const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    kitnetSize: { type: String, enum: ['pequeno', 'médio', 'grande'], required: true },
    isDelinquent: { type: Boolean, default: false },
    delinquencyTime: { type: Number, default: 0 },
    rentAmount: { type: Number, required: true }
});

module.exports = mongoose.model('Tenant', tenantSchema);
