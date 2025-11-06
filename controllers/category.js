const {Category} = require('../models');

   exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['orderIndex', 'ASC']] 
        });
        
        return res.status(200).json(categories);
    } catch (error) {
        console.error('Error receiving categories: ', error);
        return res.status(500).json({ 
            message: 'Server error when receiving categories: ', 
            error: error.message 
        });
    }
};


 exports.createCategory = async (req, res) =>{
    try {
        const NewCategory = await Category.create(req.body);
        return res.status(201).json(NewCategory);
    } catch (error) {
         console.error('Error creating category: ', error);
        return res.status(500).json({ 
            message: 'Server error when creating category: ', 
            error: error.message 
        });
    }
 };

 exports.getCategory = async (req, res) =>{
    try {
        const SearchedCategory = await Category.findOne(
            { where: { id: req.params.id } }
        );
        return res.status(200).json(SearchedCategory);
    } catch (error) {
         console.error('Error finding category: ', error);
        return res.status(500).json({ 
            message: 'Server error when finding category: ', 
            error: error.message 
        });
    }
 };
 
 exports.updateCategory = async (req, res) => {
    try {
        const [rowsUpdated, [updatedCategory]] = await Category.update(
            req.body,
            { 
                where: { id: req.params.id },
                returning: true, 
            }
        );

        if (rowsUpdated === 0) {
            return res.status(404).json({ message: 'Category is not found.' });
        }

        return res.status(200).json(updatedCategory);

    } catch (error) {
         console.error('Error updating category: ', error);
        return res.status(500).json({ 
            message: 'Server error when updating category: ', 
            error: error.message 
        });
    }
};
 exports.deleteCategory = async (req, res) =>{
    try {
        const deletedRowCount = await Category.destroy(
            { where: { id: req.params.id } }
        );
        if(deletedRowCount == 0){
            return res.status(404).json({
                message: 'Category with given ID is not found.'
            });
        }
    } catch (error) {
         console.error('Error deleting category ', error);
        return res.status(500).json({ 
            message: 'Server error when deleting category: ', 
            error: error.message 
        });
    }
 }
