const express = require('express');
const { getAllReports, createReport, updateReport, deleteReport } = require('../models/reports');
const router = express.Router();

// GET all reports
router.get('/', getAllReports);

// POST create a new report
router.post('/create', createReport);

// PUT update report by ID
router.put('/update/:report_id', updateReport);

// DELETE report by ID
router.delete('/delete/:report_id', deleteReport);

module.exports = router;
