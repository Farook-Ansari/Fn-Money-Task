const { Product } = require("../model/Product");
const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ products });
    } catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ message: err.message });
    }
};

const addProduct = async (req, res) => {
    const { productName, productDescription,productPrice, productCategory, productVariant, productQuantity,taxPercentage,taxCode,productweight,productlength,productwidth,productheight, warehouseLocation,  taxDetails, shippingDetails, productStatus, returnAndReplacement } = req.body;

    if (!productName || !productCategory || !productStatus) {
        return res.status(400).json({ error: { message: "productName, productCategory, and productStatus are required." } });
    }

    if (!mongoose.Types.ObjectId.isValid(productCategory)) {
        return res.status(400).json({ error: { message: "Invalid productCategory ID" } });
    }

    let product;
    try {
        product = new Product({
            productName,
            productDescription,
            productPrice,
            productCategory,
            productImage: req.file ? req.file.filename : null, 
            productVariant,
            productQuantity,
            taxPercentage,
            taxCode,
            productweight,
            productlength,
            productheight,
            productwidth,
            warehouseLocation,
            productStatus,
            returnAndReplacement
        });
        await product.save();
        return res.status(201).json({ product });
    } catch (err) {
        console.error("Error saving product:", err);
        return res.status(500).json({ message: "Error saving product", error: err.message });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { productName, productDescription,productPrice, productCategory, productVariant,productQuantity,taxPercentage,taxCode,productweight,productlength,productwidth,productheight,warehouseLocation, productStatus, returnAndReplacement } = req.body;
    const productImage = req.file ? req.file.filename : null; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: { message: "Invalid product ID" } });
    }

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.productName = productName || product.productName;
        product.productDescription = productDescription || product.productDescription;
        product.productPrice = productPrice || product.productPrice;
        product.productCategory = productCategory || product.productCategory;
        product.productVariant = productVariant || product.productVariant;
        product.productQuantity = productQuantity || product.productQuantity;
        product.warehouseLocation = warehouseLocation || product.warehouseLocation;
        product.taxPercentage = taxPercentage || product.taxPercentage;
        product.taxCode = taxCode || product.taxCode;
        product.productweight = productweight || product.productweight;
        product.productlength = productlength || product.productlength;
        product.productwidth = productwidth || product.productwidth;
        product.productheight = productheight || product.productheight;
        product.productStatus = productStatus || product.productStatus; 
        product.returnAndReplacement = returnAndReplacement || product.returnAndReplacement;

        if (productImage) {
            if (product.productImage) {
                const oldImagePath = path.join(__dirname, '../uploads', product.productImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); 
                }
            }
            product.productImage = productImage; 
        }

        await product.save();
        return res.status(200).json({ product });
    } catch (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: { message: "Invalid product ID" } });
    }

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.productImage) {
            const imagePath = path.join(__dirname, '../uploads', product.productImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); 
            }
        }

        await product.deleteOne(); 
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error("Error deleting product:", err);
        return res.status(500).json({ message: "Unable to delete product", error: err.message });
    }
};

exports.getAllProducts = getAllProducts;
exports.addProduct = addProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
