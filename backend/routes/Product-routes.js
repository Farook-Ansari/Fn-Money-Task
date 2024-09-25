const express = require('express');
const router = express.Router();
const productController = require("../controllers/Product-controller");

router.get('/', productController.getAllProducts);

router.post('/', productController.addProduct);

router.put('/:id', productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

module.exports = router;

