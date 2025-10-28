const { ContentItem, Category } = require('../models');


 exports.createContentItem = async (req, res) =>{
    try {
        const СategoryExists = await Category.findByPk(req.body.categoryId);
        if(СategoryExists){
            const NewContentItem  = await ContentItem.create(req.body);
            return res.status(201).json(NewContentItem);
        }
        else {
            return res.status(404).json({ message: 'Category with this ID is not found.' });
        }
    } catch (error) {
         console.error('Error creating content item: ', error);
        return res.status(500).json({ 
            message: 'Server error when creating content item: ', 
            error: error.message 
        });
    }
 };

 