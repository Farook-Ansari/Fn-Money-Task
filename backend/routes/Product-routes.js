const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require("../controllers/Product-controller");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/', productController.getAllProducts);

router.post('/', upload.single('productImage'), productController.addProduct);

router.put('/:id', upload.single('productImage'), productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

module.exports = router;
