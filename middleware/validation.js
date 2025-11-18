const { body, validationResult } = require('express-validator');

exports.categoryRules = [
    body('name')
    .isString().withMessage('Name must be a string')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),

    body('orderIndex')
    .optional()
    .isInt().withMessage('Order index must be an integer')
];

exports.contentItemRules = [
    body('title')
    .isString().withMessage('Title must be a string')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),

    body('description')
    .optional()
    .isString().withMessage('Description must be a string'),

    body('price')
    .optional()
    .isFloat({ gte: 0 }).withMessage('Price must not be a negative number'),

    body('categoryId')
    .optional()
    .isInt().withMessage('Price must be an integer'),

    body('imageUrl')
    .optional()
    .isURL().withMessage('Image URL must be a valid URL format'),
];

exports.userRules = [
    body('username')
    .isString().withMessage('Username must be a string')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),

    body('password')
    .isString().withMessage('Password must be a string')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next(); 
    }
    return res.status(400).json({ 
        message: 'Validation failed.',
        errors: errors.array() 
    });
}
