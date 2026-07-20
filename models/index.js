const Building = require('./BuildingModel');   // Pfade an deine genauen Dateinamen anpassen
const Household = require('./HouseholdModel');
const User = require('./UserModel');

// ==========================================
//  HIER WERDEN DIE ASSOZIATIONEN DEFINIERT
// ==========================================

// 1. Beziehung: Gebäude <-> Haushalte (1:N)
Building.hasMany(Household, {
    foreignKey: 'buildingId',
    as: 'households',
    onDelete: 'CASCADE'
});
Household.belongsTo(Building, {
    foreignKey: 'buildingId',
    as: 'building'
});

// 2. Beziehung: Haushalt <-> User (1:N)
Household.hasMany(User, {
    foreignKey: 'householdId',
    as: 'users'
});
User.belongsTo(Household, {
    foreignKey: 'householdId',
    as: 'household'
});

// ==========================================
//  EXPORT FÜR DIE SERVER-DATEI & REPOSITORIES
// ==========================================
module.exports = {
    Building,
    Household,
    User
};