// models/Building.js
const { DataTypes } = require('sequelize');
const db = require('../db/dbconnection');

const sequelize = db.getInstance();

const Building = sequelize.define('Building', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    address: { type: DataTypes.STRING, allowNull: false },
    latitude: { type: DataTypes.FLOAT },
    longitude: { type: DataTypes.FLOAT },
    radiusMeters: { type: DataTypes.FLOAT, field: 'radius_meters' },
    buildingToken: { type: DataTypes.STRING, field: 'building_token' },
    maxCapacity: { type: DataTypes.INTEGER, field: 'max_capacity' },
    currentCount: { type: DataTypes.INTEGER, field: 'current_count' }
}, {
    tableName: 'buildings',
    timestamps: false
});

module.exports = Building;