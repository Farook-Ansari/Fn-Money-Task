const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/Category-controller");

// Route to get all categories
router.get('/', categoryController.getAllCategories);

// Route to add a new category (with image upload)
router.post('/', categoryController.addCategory);

// Route to update a category by ID (with image upload)
router.put('/:id', categoryController.updateCategory);

// Route to delete a category by ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
