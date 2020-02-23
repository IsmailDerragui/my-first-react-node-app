const jwt = require('jsonwebtoken');

exports.verify_token = (req, res, next) => {
    let token = req.headers['authorization'];
    
    if (token) {
        jwt.verify(token, 'HNqpS5AqarxkgGZd', (error, result) => {
            if (error) {
                res.status(403);
                res.json({message: "Access denied"});
            } else {
                next();
            }
        });
    } else {
        res.status(403);
        res.json({message: "Access denied"});
    }
}