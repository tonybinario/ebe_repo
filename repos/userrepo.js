const db = require('../db/dbconnection');
const {User} = require('../models/index'); // Pfad zu deinem eben definierten User-Model anpassen

class UserRepository {
    constructor() {
        this.sequelize = db.getInstance();
    }

    // Holt alle User flach (als reine JSON-Objekte ohne Sequelize-Instanz-Methoden)
    async getAllUsersFlat() {
        return await User.findAll({ raw: true });
    }

    // Holt alle User (optional direkt mit dem verknüpften Haushalt)
    async getAllUsers() {
        return await User.findAll({
            include: ['household'] // Nutzt den Alias aus der Assoziation
        });
    }

    // Holt einen einzelnen User anhand seiner ID (Primärschlüssel)
    async getUserById(id) {
        return await User.findByPk(id);
    }

    // Holt alle User, die zu einem bestimmten Haushalt gehören
    async getUsersByHouseholdId(householdId) {
        return await User.findAll({
            where: {
                householdId: householdId // Sequelize wandelt das automatisch in household_id = $1 um
            }
        });
    }

    // Erstellt einen neuen User
    async createUser(userData) {
        // Übergib einfach das Objekt. Sequelize kümmert sich um optionale Felder
        // und setzt die Defaults (z.B. role: 'user', oder false für die Booleans)
        return await User.create(userData);
    }
}

module.exports = new UserRepository();