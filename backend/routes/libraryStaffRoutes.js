const { 
    getAllStaffMembers, 
    getStaffMember,
    createStaffMember, 
    updateStaffInfo 
} = require('../models/library_staff');

const express = require('express');
const router = express.Router();

// GET all staff members
router.get('/', getAllStaffMembers);

// GET staff by id
router.get('/:staff_id', getStaffMember)

// POST create a new staff member
router.post('/create', createStaffMember);

// PUT update staff information by ID
router.put('/update/:staff_id', updateStaffInfo);

module.exports = router;
