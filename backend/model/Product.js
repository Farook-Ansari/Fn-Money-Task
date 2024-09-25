const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    productName: {
        type: String,
        trim: true,
    },
    productDescription: {
        type: String,
        trim: true,
    },
    productCategory: {
        type: String,
        ref: 'Category',
        required: true,
        
    },
    productImage: {
        type: String,
    },
    productVariant: {
        type: String,
        default: null,
    },
    inventoryDetails: {
        quantity: { type: Number, default: 0 },
        warehouseLocation: { type: String, trim: true },
    },
    taxDetails: {
        taxCode: { type: String, trim: true },
        taxPercentage: { type: Number, default: 0 },
    },
    productStatus: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
    },
    shippingDetails: {
        weight: { type: Number, },
        dimensions: {
            length: { type: Number,  },
            width: { type: Number,  },
            height: { type: Number, },
        },
    },
    returnAndReplacement: {
        type: String,
        enum: ["No Return", "7 Days Replacement", "30 Days Return"],
        default: "No Return",
    },
}, { timestamps: true });

// Category Schema
const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true,
        trim: true,
    },
    categoryImage: {
        type: String,
        default: null,
    },
    categoryDescription: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
const Category = mongoose.model("Category", categorySchema);

module.exports = { Product, Category };
