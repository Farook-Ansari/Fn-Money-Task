const mongoose = require("mongoose");
const { Schema } = mongoose;

// Product Schema
const productSchema = new Schema({
    productName: {
        type: String,
        trim: true,
        required: true,
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
    productPrice:{
        type: Number, 
   },
    productImage: {
        type: String,
        required: true, 
        default: ""     
    },
    productVariant: {
        type: String,
    },

    productQuantity:{
         type: Number, 
    },
    warehouseLocation:{
        type: String, 
        trim: true
   },

    taxPercentage:{
        type: Number, 
   },
   taxCode:{
       type: String, 
       trim: true
  },

    productStatus: {
        type: String,
        enum: ["Available", "Sold"],
        default: "Available",
    },
    productweight:{
        type: Number, 
   },
   productlength:{
    type: Number, 
    },
    productwidth:{
        type: Number, 
   },
   productheight:{
    type: Number, 
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
