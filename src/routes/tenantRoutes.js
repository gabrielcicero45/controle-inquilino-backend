const express = require('express');
const { getAllTenants, createTenant, updateTenant, deleteTenant, calculateDeliquency } = require('../controllers/tenantController');
const router = express.Router();

router.get('/', getAllTenants);
router.post('/', createTenant);
router.put('/:tenantId', updateTenant);
router.delete('/:tenantId', deleteTenant);


router.get('/deliquencyReport', calculateDeliquency);


module.exports = router;
