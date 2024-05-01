const express = require('express');
const { getAllReports, createReport, updateReport, deleteReport } = require('../models/reports');
const reportRouter = express.Router();

// GET all reports
reportRouter.get('/', getAllReports);

// POST create a new report
reportRouter.post('/create', createReport);

// PUT update report by ID
reportRouter.put('/update/:report_id', updateReport);

// DELETE report by ID
reportRouter.delete('/delete/:report_id', deleteReport);

module.exports = reportRouter;
