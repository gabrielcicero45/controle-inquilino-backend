const express = require('express');
const { getAllTenants, createTenant,getTenant, updateTenant, deleteTenant, calculateDelinquency } = require('../controllers/tenantController');
const router = express.Router();

router.get('/', getAllTenants);
router.post('/', createTenant);

router.get('/delinquencyReport', calculateDelinquency);
router.get('/:tenantId', getTenant);

router.put('/:tenantId', updateTenant);

router.delete('/:tenantId', deleteTenant);

module.exports = router;
