const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        // Mailtrap SMTP Konfiguration
        this.transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER, // Dein Mailtrap Username aus der .env
                pass: process.env.MAILTRAP_PASS  // Dein Mailtrap Passwort aus der .env
            }
        });
    }

    /**
     * Sendet den Magic Link zur E-Mail-Verifizierung
     * @param {string} toEmail - Die E-Mail-Adresse des Users
     * @param {string} token - Der generierte Verifizierungstoken
     */
    async sendVerificationEmail(toEmail, token) {
        // Der Link, den das Frontend aufrufen wird
        const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

        const mailOptions = {
            from: '"Dein App Team" <noreply@deineapp.com>',
            to: toEmail,
            subject: '🔑 Dein Verifizierungs-Link',
            text: `Hallo! Bitte verifiziere deine E-Mail, indem du auf folgenden Link klickst: ${verificationLink}`,
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Willkommen an Bord!</h2>
          <p>Klicke auf den Button unten, um deine E-Mail-Adresse zu verifizieren. Der Link ist für 15 Minuten gültig.</p>
          <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">E-Mail verifizieren</a>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">Falls das nicht funktioniert, kopiere diesen Link in deinen Browser: <br> ${verificationLink}</p>
        </div>
      `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`[Mailtrap] E-Mail erfolgreich versendet! Message ID: ${info.messageId}`);
            return info;
        } catch (error) {
            console.error('Fehler beim E-Mail-Versand über Mailtrap:', error);
            throw new Error('E-Mail-Versand fehlgeschlagen.');
        }
    }
}

module.exports = new EmailService();