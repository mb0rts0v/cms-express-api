const jwt = require('jsonwebtoken');
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ 
            message: 'Access Denied. No token provided.' 
        });
    }

    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded){
            if (err){
                return res.status(403).json({ message: 'Invalid token.'  });
            } else {
                req.user = decoded;
                next();
            }
        });
}