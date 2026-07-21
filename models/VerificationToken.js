const { DataTypes } = require('sequelize');
const db = require('../db/dbconnection'); // <--- Oder wie auch immer dein DB-Import in den anderen Modellen aussieht!

const sequelize = db.getInstance();

const Token = sequelize.define('VerificationToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'member'
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'verification_tokens',
    underscored: true,
    timestamps: false // Falls du keine createdAt/updatedAt in dieser Tabelle hast
});

module.exports = Token;