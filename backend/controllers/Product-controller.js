const { Product } = require("../model/Product");
const mongoose = require("mongoose");

const getAllProducts = async (req, res) => {
    let products;
    try {
        products = await Product.find();
    } catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ message: err.message });
    }
    return res.status(200).json({ products });
};

const addProduct = async (req, res) => {
    const { productName, productDescription, productCategory, productImage, productStatus } = req.body;

    console.log("Received product data:", req.body); 

    if (!mongoose.Types.ObjectId.isValid(productCategory)) {
        return res.status(400).json({ error: { message: "Invalid productCategory ID" } });
    }

    let product;
    try {
        product = new Product({ productName, productDescription, productCategory, productImage, productStatus });
        await product.save();
    } catch (err) {
        console.error("Error saving product:", err);
        return res.status(500).json({ message: err.message });
    }
    return res.status(201).json({ product });
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { productName, productDescription, productCategory, productImage, productStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: { message: "Invalid product ID" } });
    }

    let product;
    try {
        product = await Product.findByIdAndUpdate(id, {
            productName,
            productDescription,
            productCategory,
            productImage,
            productStatus
        }, { new: true });
    } catch (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ message: err.message });
    }

    if (!product) {
        return res.status(404).json({ error: { message: "Product not found" } });
    }
    return res.status(200).json({ product });
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: { message: "Invalid product ID" } });
    }

    let product;
    try {
        product = await Product.findByIdAndDelete(id);
    } catch (err) {
        console.error("Error deleting product:", err);
        return res.status(500).json({ message: err.message });
    }

    if (!product) {
        return res.status(404).json({ error: { message: "Product not found" } });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
};

exports.getAllProducts = getAllProducts;
exports.addProduct = addProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
