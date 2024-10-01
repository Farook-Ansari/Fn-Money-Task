const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/Category-controller");
const multer = require('multer'); 


const upload = multer({ dest: 'uploads/' });

router.get('/', categoryController.getAllCategories);

router.get('/:id', categoryController.getCategory);

router.post('/', upload.single('categoryImage'), categoryController.addCategory);

router.put('/:id', upload.single('categoryImage'), categoryController.updateCategory);

router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
