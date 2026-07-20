// db/dbconnection.js
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

class DatabaseConnection {
    constructor() {
        // Hier initialisieren wir Sequelize statt dem pg-Pool
        this.sequelize = new Sequelize('ebe_db', 'postgres', 'postgres', {
            host: 'localhost',
            dialect: 'postgres',
            logging: false // Schaltet das standardmäßige SQL-Logging aus
        });
    }

    // Führt alle SQL-Migrationsskripte aus (deine Logik bleibt!)
    async init() {
        const migrationsDir = path.join(process.cwd(), 'db', 'migrations');
        try {
            if (!fs.existsSync(migrationsDir)) {
                console.log('Migrationsverzeichnis nicht gefunden.');
                return;
            }

            const files = fs.readdirSync(migrationsDir)
                .filter(file => file.endsWith('.sql'))
                .sort();

            console.log(`${files.length} Migrationsdatei(en) gefunden.`);

            for (const file of files) {
                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, 'utf8');

                try {
                    // Sequelize führt hier das rohe SQL deiner Skripte aus
                    await this.sequelize.query(sql);
                    console.log(`✓ Migration ausgeführt: ${file}`);
                } catch (error) {
                    console.error(`✗ Fehler bei Migration ${file}:`, error.message);
                }
            }
        } catch (error) {
            console.error('Fehler beim Laden der Migrationen:', error);
        }
    }

    // Gibt die Sequelize-Instanz für die Models zurück
    getInstance() {
        return this.sequelize;
    }

    // Schließt die Verbindung sauber
    async disconnect() {
        await this.sequelize.close();
    }
}

module.exports = new DatabaseConnection();