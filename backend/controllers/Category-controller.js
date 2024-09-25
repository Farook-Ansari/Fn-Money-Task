const { Category } = require("../model/Product"); // Ensure this path is correct

const getAllCategories = async (req, res, next) => {
    let categories;
    try {
        categories = await Category.find();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    if (!categories) {
        return res.status(404).json({ message: "No categories found" });
    }
    return res.status(200).json({ categories });
};


const addCategory = async (req, res, next) => {
    const { categoryName, categoryImage, categoryDescription } = req.body;
    let category;
    try {
        category = new Category({
            categoryName,
            categoryImage,
            categoryDescription
        });
        await category.save();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    return res.status(201).json({ category });
};


const updateCategory = async (req, res, next) => {
    const { id } = req.params;
    const { categoryName, categoryImage, categoryDescription } = req.body;

    let category;
    try {
        category = await Category.findByIdAndUpdate(id, {
            categoryName,
            categoryImage,
            categoryDescription
        }, { new: true });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({ category });
};

const deleteCategory = async (req, res) => {
    const { id } = req.params; 
    try {
        const category = await Category.findByIdAndDelete(id); 
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error); 
        return res.status(500).json({ message: error.message });
    }
};


exports.getAllCategories = getAllCategories;
exports.addCategory = addCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
