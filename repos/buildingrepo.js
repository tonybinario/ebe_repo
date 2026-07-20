const db = require('../db/dbconnection');
const {Building} = require('../models/index'); // Das Model aus Schritt 2

class BuildingRepository {
    constructor() {
        this.sequelize = db.getInstance();
    }

    async createBuilding(buildingData){
        return Building.create(buildingData);
    }

    async getAllBuildings() {
        return await Building.findAll({
            include: ['households']
        });
    }

    async getBuildingById(id) {
        return await Building.findByPk(id);
    }
}

module.exports = new BuildingRepository();