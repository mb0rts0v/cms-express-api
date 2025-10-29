const {User} = require('../models');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

exports.signup = async (req, res) => {
    try {
        const NewUser = await User.create(req.body);
        return res.status(201).json(NewUser);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ 
            message: 'Error: User with this name already exists.' 
        });
    }
         console.error('Error signing up: ', error);
        return res.status(500).json({ 
            message: 'Server error when signing up: ', 
            error: error.message 
        });
    }
}

exports.login = async (req, res) => {
    try {
        const LoginginUser = await User.findOne({
            where: { 
        username: req.body.username 
    }
        })
        if(LoginginUser){
            const isMatch = await bcryptjs.compare(req.body.password, LoginginUser.password);
            if (isMatch) {
                const token = jwt.sign(
                    { id: LoginginUser.id, username: LoginginUser.username }, 
                    process.env.SECRET_KEY, 
                    { expiresIn: '3h' } 
                );
                return res.status(200).json({ 
                    message: "Login success", 
                    token: token,
                    userId: LoginginUser.id 
                });
            }
            else{
                return res.status(401).json({ message: "Wrong username or password." });
            }
        }
        else{
             return res.status(401).json({ message: "Wrong username or password." })
        }
    } catch (error) {
        console.error('Error logging in: ', error);
        return res.status(500).json({ 
            message: 'Server error when  logging in: ', 
            error: error.message 
    })
}
}
