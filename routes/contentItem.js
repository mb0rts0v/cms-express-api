
const express = require('express');
const router = express.Router();


const contentItemController = require('../controllers/contentItem.js'); 
const authMiddleware = require('../middleware/auth');
const validationMiddleware = require('../middleware/validation');
const uploadMiddleware = require('../middleware/upload');

router.post('/', authMiddleware.verifyToken, validationMiddleware.contentItemRules, validationMiddleware.validate,  contentItemController.createContentItem);
router.get('/', contentItemController.getAllContentItems);
router.get('/:id', contentItemController.getContentItem);
router.delete('/:id', authMiddleware.verifyToken, contentItemController.deleteContentItem);
router.put('/:id', authMiddleware.verifyToken, validationMiddleware.contentItemRules, validationMiddleware.validate, contentItemController.updateContentItem);
router.post('/upload', authMiddleware.verifyToken, uploadMiddleware.uploadImage, contentItemController.uploadImageHandler);

module.exports = router;