const jwt = require('jsonwebtoken');

class AuthRepository {
    // 15-Minuten-Token für die E-Mail
    generateVerificationToken(email) {
        return jwt.sign(
            { email, purpose: 'email-verification' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
    }

    // Long-Term Session-Token für die Flutter-App
    generateSessionToken(user) {
        return jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );
    }

    // Prüft mathematisch, ob das E-Mail-Token gültig/unverfälscht ist
    verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
}

module.exports = new AuthRepository();