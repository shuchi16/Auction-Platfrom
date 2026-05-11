// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header (Format: "Bearer <token>")
    const token = req.header('Authorization')?.split(' ')[1];

    // Check if no token exists
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the user payload to the request object
        next(); // Move on to the next function
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};