const { 
    getCategories, 
    getCategoryById, 
    createCategory, 
    updateCategoryById 
} = require('../models/categories');
const express = require('express');
const router = express.Router();

// GET all categories
router.get('/', getCategories);

// GET category by ID
router.get('/:category_id', getCategoryById);

// POST create new category
router.post('/add', createCategory);

// PUT update category by ID
router.put('/edit/:category_id', updateCategoryById);

module.exports = router;
