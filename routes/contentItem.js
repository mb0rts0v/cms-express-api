
const express = require('express');
const router = express.Router();


const contentItemController = require('../controllers/contentItem.js'); 


router.post('/', contentItemController.createContentItem);
module.exports = router;