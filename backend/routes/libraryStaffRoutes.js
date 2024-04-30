const { 
    getAllStaffMembers, 
    createStaffMember, 
    updateStaffInfo 
} = require('../models/staffMembers');

const express = require('express');
const libraryStaffRouter = express.Router();

// GET all staff members
libraryStaffRouter.get('/', getAllStaffMembers);

// POST create a new staff member
libraryStaffRouter.post('/create', createStaffMember);

// PUT update staff information by ID
libraryStaffRouter.put('/update/:staff_id', updateStaffInfo);

module.exports = libraryStaffRouter;
