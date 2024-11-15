const Tenant = require('../models/Tenant');

exports.getAllTenants = async (req, res) => {
    try {
        const tenants = await Tenant.find();
        res.json(tenants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createTenant = async (req, res) => {
    const { name, cpf, kitnetSize, isDeliquent, deliquencyTime, rentAmount } = req.body;

    try {
        const newTenant = new Tenant({ name, cpf, kitnetSize, isDeliquent, deliquencyTime, rentAmount });
        await newTenant.save();
        res.status(201).json(newTenant);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateTenant = async (req, res) => {
    const { tenantId } = req.params;
    const { name, cpf, kitnetSize, isDeliquent, deliquencyTime, rentAmount } = req.body;

    try {
        const tenant = await Tenant.findByIdAndUpdate(tenantId, {
            name, cpf, kitnetSize, isDeliquent, deliquencyTime, rentAmount
        }, { new: true });
        res.json(tenant);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteTenant = async (req, res) => {
    const { tenantId } = req.params;

    try {
        await Tenant.findByIdAndDelete(tenantId);
        res.json({ message: 'Inquilino excluído com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.calculateDeliquency = async (req, res) => {
    try {
        const tenants = await Tenant.find({ isDeliquent: true });
        const totalTenants = await Tenant.countDocuments();
        const delinquentTenants = tenants.length;
        const deliquencyPercentage = (delinquentTenants / totalTenants) * 100;

        res.json({ deliquencyPercentage, tenants });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
