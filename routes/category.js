
const express = require('express');
const router = express.Router();


const categoryController = require('../controllers/category'); 
const authMiddleware = require('../middleware/auth');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategory)
router.post('/', authMiddleware.verifyToken, categoryController.createCategory);
router.delete('/:id', authMiddleware.verifyToken, categoryController.deleteCategory)
router.put('/:id', authMiddleware.verifyToken, categoryController.updateCategory)

module.exports = router;