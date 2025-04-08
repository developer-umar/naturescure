const express = require("express");
const { getAllPlants, getPlantById, searchPlants,ayurveda,unani,naturopathy,siddha,homeopathy } = require("../controllers/plantControllers");

const router = express.Router();

// Route to get all plants
router.get("/", getAllPlants);

// Place the search route BEFORE the getPlantById route
router.get("/search", searchPlants);

// Route to get a single plant by ID
router.get("/:id", getPlantById);

router.get("/category/ayurveda",ayurveda );

router.get("/category/unani",unani);

router.get("/category/naturopathy",naturopathy);

router.get("/category/siddha",siddha);

router.get("/category/homeopathy",homeopathy);






module.exports = router;

