
const express = require('express');
const router = express.Router();


const categoryController = require('../controllers/category'); 
const authMiddleware = require('../middleware/auth');
const validationMiddleware = require('../middleware/validation');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', authMiddleware.verifyToken, validationMiddleware.categoryRules, validationMiddleware.validate, categoryController.createCategory);
router.delete('/:id', authMiddleware.verifyToken, categoryController.deleteCategory);
router.put('/:id', authMiddleware.verifyToken, validationMiddleware.categoryRules, validationMiddleware.validate, categoryController.updateCategory);

module.exports = router;