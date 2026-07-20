const express = require('express');
const router = express.Router();
const buildingRepository = require('../repos/buildingrepo');

// GET /api/buildings
router.get('/', async (req, res) => {
    try {
        // Prüfe, ob der Query-Parameter gesetzt ist
        const includeHouseholds = req.query.include === 'households';

        const buildings = await buildingRepository.getAllBuildings(includeHouseholds);
        res.json(buildings);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// router.get('/flat', async (req, res) => {
//     try {
//         const buildings = await buildingRepository.getAllBuildingsFlat();
//         res.json(buildings);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// GET /api/buildings/:id
router.get('/:id', async (req, res) => {
    try {
        const building = await buildingRepository.getBuildingById(req.params.id);
        if (!building) return res.status(404).json({error: "Gebäude nicht gefunden"});
        res.json(building);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.post('/', async (req, res) => {
    try {
        const building = await buildingRepository.createBuilding(req.body);
        res.status(201).json(building);

    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
