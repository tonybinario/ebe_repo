const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const { Building, Household, User } = require("./models/index");
// Deine Router-Imports können genau so bleiben wie sie sind!
const usersRouter = require('./routes/users');
const buildingsRouter = require('./routes/buildings');
const householdsRouter = require('./routes/households');

const app = express();

// 1. Globale Middlewares
app.use(express.json());

// // CORS aktivieren (Wichtig, falls dein Frontend auf einem anderen Port/Domain läuft)
// // Falls du das 'cors' Paket nicht installieren willst, reichen diese Header:
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(200);
//     }
//     next();
// });

// 2. Frontend Statisch ausliefern (Wichtig für das Smartphone!)
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// 3. REST-Router registrieren
app.use('/api/users', usersRouter);
app.use('/api/buildings', buildingsRouter);
app.use('/api/households', householdsRouter);

// 4. 404-Handler (wenn keine Route matcht)
app.use((req, res) => {
    res.status(404).json({ error: 'Route nicht gefunden' });
});

// 6. Asynchrone Start-Funktion (löst das "Top-Level-Await"-Problem)
async function startServer() {
    try {
        // Datenbank initialisieren
        console.log('DB-Initialisierung erfolgreich abgeschlossen.');

        // HTTPS Zertifikate laden
        const httpsOptions = {
            key: fs.readFileSync(path.join(__dirname, 'server.key')),
            cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
        };

        const PORT = process.env.PORT || 443;

        // Server starten
        https.createServer(httpsOptions, app).listen(PORT, () => {
            console.log(`\n==================================================`);
            console.log(` Master-HTTPS-Server läuft stabil auf Port ${PORT}`);
            console.log(` API-Endpunkt: https://localhost:${PORT}/api`);
            console.log(` Frontend:     https://localhost:${PORT}/`);
            console.log(`==================================================\n`);
        });

    } catch (error) {
        console.error("Kritischer Fehler beim Serverstart:", error.message);
        process.exit(1); // Beendet die App, da ohne DB/SSL nichts geht
    }
}

// App starten
startServer();