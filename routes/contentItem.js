
const express = require('express');
const router = express.Router();


const contentItemController = require('../controllers/contentItem.js'); 


router.post('/', contentItemController.createContentItem);
router.get('/', contentItemController.getAllContentItems);
router.get('/:id', contentItemController.getContentItem);
router.delete('/:id', contentItemController.deleteContentItem)
router.put('/:id', contentItemController.updateContentItem)
module.exports = router;