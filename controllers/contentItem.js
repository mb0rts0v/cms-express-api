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


exports.getAllContentItems = async (req, res) => {
    try {
        const contentItems = await ContentItem.findAll({

            include: [{ 
                model: Category, 
                as: 'Category', 
                attributes: ['id', 'name'] 
            }],
            order: [['id', 'ASC']]
        });
        
        return res.status(200).json(contentItems);
    } catch (error) {
        console.error('Error finding content items:', error);
        return res.status(500).json({ 
            message: 'Server error when finding content items' 
        });
    }
};

 exports.getContentItem = async (req, res) =>{
    try {
        const SearchedContentItem = await ContentItem.findOne(
            { where: { id: req.params.id },
            include: [{ 
                model: Category, 
                as: 'Category', 
                attributes: ['id', 'name'] 
            }] }
        );
        return res.status(200).json(SearchedContentItem);
    } catch (error) {
         console.error('Error finding content item: ', error);
        return res.status(500).json({ 
            message: 'Server error when finding content item: ', 
            error: error.message 
        });
    }
 };
 

 exports.deleteContentItem = async (req, res) =>{
    try {
        const deletedRowCount = await ContentItem.destroy(
            { where: { id: req.params.id } }
        );
        if(deletedRowCount == 0){
            return res.status(404).json({
                message: 'Content item with given ID is not found.'
            });
        }
        return res.status(204).json();
    } catch (error) {
         console.error('Error deleting content item ', error);
        return res.status(500).json({ 
            message: 'Server error when deleting content item: ', 
            error: error.message 
        });
    }
 };


exports.updateContentItem = async (req, res) => {
    try {
        const ContentItemExists = await ContentItem.findByPk(req.params.id);
        if (!ContentItemExists) {
            return res.status(404).json({ message: 'Content item is not found.' });
        }

        if (req.body.categoryId) {
           const CategoryExists = await Category.findByPk(req.body.categoryId);
           if (!CategoryExists) {
               return res.status(400).json({ message: 'The new category ID does not exist.' });
           }
        }

        const [rowsUpdated, updatedItems] = await ContentItem.update(
            req.body,
            { 
                where: { id: req.params.id },
                returning: true, 
            }
        );

        if (rowsUpdated > 0) {
            const updatedContentItem = updatedItems[0];
            return res.status(200).json(updatedContentItem);
        } 
        
        return res.status(204).end(); 

    } catch (error) {
         console.error('Error updating content item: ', error);
        return res.status(500).json({ 
            message: 'Server error when updating content item: ', 
            error: error.message 
        });
    }
};

 
