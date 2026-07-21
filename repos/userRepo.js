const db = require('../db/dbconnection');
const {User} = require('../models'); // Pfad zu deinem eben definierten User-Model anpassen

class UserRepository {
    constructor() {
        this.sequelize = db.getInstance();
    }
/**
* @param {string} email
* @returns {Promise<User|null>}
 * */
    async findByEmail(email){

        return await User.findOne({
            where: {email: email}
        });
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

    async updateEmailVerified(email) {
        // Führt direkt das SQL-UPDATE aus
        return await User.update(
            { isEmailVerified: true },
            { where: { email: email } }
        );
    }

    // Erstellt einen neuen User
    async createUser(userData) {
        // Übergib einfach das Objekt. Sequelize kümmert sich um optionale Felder
        // und setzt die Defaults (z.B. role: 'user', oder false für die Booleans)
        return User.create(userData);
    }
}

module.exports = new UserRepository();