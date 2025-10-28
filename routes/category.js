
const express = require('express');
const router = express.Router();


const categoryController = require('../controllers/category'); 


router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategory)
router.post('/', categoryController.createCategory);
router.delete('/:id', categoryController.deleteCategory)
router.put('/:id', categoryController.updateCategory)

module.exports = router;