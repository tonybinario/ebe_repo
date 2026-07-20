const db = require('../db/dbconnection');
const {Household} = require('../models/index'); // Pfad zu deinem Household-Model anpassen

class HouseholdRepository {
    constructor() {
        this.sequelize = db.getInstance();
    }

    // Holt alle Haushalte flach als reine JSON-Objekte
    async getAllHouseholdsFlat() {
        return await Household.findAll({ raw: true });
    }

    // Holt alle Haushalte inklusive der verknüpften User
    async getAllHouseholds() {
        return await Household.findAll({
            include: ['users'] // Nutzt den Alias aus der Assoziations-Definition
        });
    }

    // Holt einen einzelnen Haushalt anhand seiner ID
    async getHouseholdById(id) {
        return await Household.findByPk(id);
    }

    // Holt alle Haushalte, die zu einem bestimmten Gebäude gehören
    async getHouseholdsByBuildingId(buildingId) {
        return await Household.findAll({
            where: {
                buildingId: buildingId // Sequelize mappt das automatisch auf building_id
            }
        });
    }

    // Erstellt einen neuen Haushalt
    async createHousehold(householdData) {
        // Übergib einfach das Objekt. Sequelize kümmert sich um die Benennung (CamelCase -> Snake_Case)
        // und setzt den Default-Wert für isActive automatisch auf true.
        return Household.create(householdData);
    }
}

module.exports = new HouseholdRepository();