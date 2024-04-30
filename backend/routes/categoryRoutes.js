const { 
    getCategories, 
    getCategoryById, 
    createCategory, 
    updateCategoryById 
} = require('../models/categories');

// GET all categories
categoryRouter.get('/', getCategories);

// GET category by ID
categoryRouter.get('/:category_id', getCategoryById);

// POST create new category
categoryRouter.post('/add', createCategory);

// PUT update category by ID
categoryRouter.put('/edit/:category_id', updateCategoryById);

module.exports = categoryRouter;
