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
    const { name, cpf, kitnetSize, isDelinquent, delinquencyTime, rentAmount } = req.body;

    try {
        const newTenant = new Tenant({ name, cpf, kitnetSize, isDelinquent, delinquencyTime, rentAmount });
        await newTenant.save();
        res.status(201).json(newTenant);
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({ message: err.message });
    }
};

exports.getTenant = async (req, res) => {
    const { tenantId } = req.params;
    const { name, cpf, kitnetSize, isDelinquent, delinquencyTime, rentAmount } = req.body;

    try {
        const tenant = await Tenant.findById(tenantId);
        res.json(tenant);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateTenant = async (req, res) => {
    const { tenantId } = req.params;
    const { name, cpf, kitnetSize, isDelinquent, delinquencyTime, rentAmount } = req.body;
    
    try {
        const tenant = await Tenant.findByIdAndUpdate(tenantId, {
            name, cpf, kitnetSize, isDelinquent, delinquencyTime, rentAmount
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


exports.calculateDelinquency = async (req, res) => {
    try {
        const delinquentTenants = await Tenant.find({ isDelinquent: true });
        const upToDateTenants = await Tenant.find({ isDelinquent: false });
        const totalTenants = await Tenant.countDocuments();
        
        const delinquencyPercentage = (delinquentTenants.length / totalTenants) * 100;
        const damage = delinquentTenants.reduce((total, tenant) => {
            const amountOwed = tenant.delinquencyTime * tenant.rentAmount;
            return total + amountOwed;
        }, 0);
        const income = upToDateTenants.reduce((total, tenant) => {
            const amountEarned = tenant.rentAmount;
            return total + amountEarned;
        }, 0);

        res.json({ delinquencyPercentage, tenants: delinquentTenants, income, damage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
