const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Kein Token bereitgestellt. Zugriff verweigert.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Hängt { userId, email, role } an das req-Objekt an
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Ungültiges oder abgelaufenes Session-Token.' });
    }
};