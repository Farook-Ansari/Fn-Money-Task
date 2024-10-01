const { Category } = require('../model/Product');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addCategory = async (req, res, next) => {
  const { categoryName, categoryDescription } = req.body;
  const categoryImage = req.file ? req.file.filename : null; 

  let category;
  try {
    category = new Category({
      categoryName,
      categoryDescription,
      categoryImage,
    });
    await category.save();
  } catch (err) {
    console.error("Error adding category:", err); 
    return res.status(500).json({ message: "Unable to save category", error: err.message });
  }
  return res.status(201).json({ category });
};

  const getCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json({ category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { categoryName, categoryDescription } = req.body;
  const categoryImage = req.file ? req.file.filename : null; 

  let category;
  try {
    category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.categoryName = categoryName || category.categoryName;
    category.categoryDescription = categoryDescription || category.categoryDescription;
    if (categoryImage) category.categoryImage = categoryImage;

    await category.save();
  } catch (err) {
    return res.status(500).json({ message: "Unable to update category" });
  }
  return res.status(200).json({ category });
};

const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  let category;
  try {
    category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    console.log("Category found for deletion:", category);

    if (category.categoryImage) {
      const imagePath = path.join(__dirname, '../uploads', category.categoryImage);  
      console.log("Attempting to delete image at:", imagePath);

      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath); 
          console.log("Image successfully deleted:", imagePath);
        } catch (err) {
          console.error("Error deleting image file:", err);
        }
      } else {
        console.log("Image not found at:", imagePath);
      }
    }

    await category.deleteOne();

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err); 
    return res.status(500).json({ message: "Unable to delete category", error: err.message });
  }
};
 
exports.getAllCategories = getAllCategories;
exports.getCategory = getCategory;
exports.addCategory = addCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
