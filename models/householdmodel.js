const { DataTypes } = require('sequelize');
const db = require('../db/dbconnection');

const sequelize = db.getInstance();

const Household = sequelize.define('Household', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    buildingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'building_id'
    },
    apartmentName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'apartment_name'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'households',
    timestamps: false // Deaktiviert created_at und updated_at, passend zu deinen anderen Models
});

module.exports = Household;