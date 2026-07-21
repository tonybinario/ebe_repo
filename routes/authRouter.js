const express = require('express');
const router = express.Router();
const authRepository = require('../repos/authRepo');
const emailService = require('../services/emailService');
const userRepository = require('../repos/userRepo');
const authMiddleware = require('middleware/authMiddleware');


// SCHRITT 1: Mail anfordern (Login/Registrierung)
router.post('/request-link', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'E-Mail fehlt.' });

        // JWT generieren (0 DB-Zugriffe!)
        const verificationToken = authRepository.generateVerificationToken(email);

        // Link an die App / Mail senden
        const magicLink = `https://deineapp.de/verify?token=${verificationToken}`;
        await emailService.sendVerificationEmail(email, magicLink);

        return res.json({ message: 'Link wurde gesendet.' });
    } catch (error) {
        return res.status(500).json({ message: 'Serverfehler' });
    }
});

// Fast auth
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // req.user.userId kommt direkt aus der Auth-Middleware!
        const user = await userRepository.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User nicht gefunden.' });
        }

        // Gibt einfach genau die Daten zurück, die dein Modell hat:
        return res.json({
            user: {
                id: user.id,
                email: user.email,
                isEmailVerified: user.isEmailVerified,
                isBuildingAdmin: user.isBuildingAdmin,
                householdId: user.householdId
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Serverfehler' });
    }
});

// SCHRITT 2: Token einlösen & Einloggen
router.post('/verify-email', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: 'Token fehlt.' });

        // 1. JWT mathematisch prüfen (fliegt in den catch-Block bei Ablauf)
        const decoded = authRepository.verifyToken(token);
        console.log("token :" + token)
        if (decoded.purpose !== 'email-verification') {
            return res.status(400).json({ message: 'Ungültiger Token-Typ.' });
        }

        // 2. User in Postgres suchen oder anlegen
        let user = await userRepository.findByEmail(decoded.email);

        if (!user) {
            // Erstmaliger Login -> User anlegen
            user = await userRepository.createUser({
                email: decoded.email,
                isEmailVerified: true
            });
        } else if (!user.isEmailVerified) {
            console.log("isverified: "+user.isEmailVerified)
            // Bestehender User -> Flag setzen
            await userRepository.updateEmailVerified(decoded.email);
        }

        // 3. Session-JWT für Flutter ausgeben
        const sessionToken = authRepository.generateSessionToken(user);

        return res.json({
            message: 'Erfolgreich verifiziert!',
            token: sessionToken,
            user: { id: user.id, email: user.email }
        });

    } catch (error) {
        return res.status(400).json({ message: 'Link ungültig oder abgelaufen.' });
    }
});

module.exports = router;