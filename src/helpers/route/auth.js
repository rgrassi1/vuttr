const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: 'Token not provided' })
    }
    const [bearer, token] = authorization.split(' ');
    try {
        const { _id, name, email, role } = jwt.verify(token, process.env.APP_SECRET);        
        req.user = { _id, name, email, role };
        return next();
    } catch (error) {
        res.status(401).json({ message: 'Token not valid' })
    }
}