const { DataTypes } = require('sequelize');
const db = require('../db/dbconnection');

const sequelize = db.getInstance();

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    householdId: {
        type: DataTypes.INTEGER,
        field: 'household_id'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_email_verified'
    },
    isBuildingAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_building_admin'
    }
}, {
    tableName: 'users',
    timestamps: false // Deaktiviert created_at und updated_at, genau wie bei deinem Building-Model
});

module.exports = User;