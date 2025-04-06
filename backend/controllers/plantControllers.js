const Plant = require("../models/Plant");

// Get All Plants
exports.getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find();
    console.log("All Plants from DB:", plants); //  Debug output
    res.json(plants);
  } catch (error) {
    console.error("Error fetching plants:", error);
    res.status(500).json({ message: "Error fetching plants" });
  }
};

// Get Single Plant
exports.getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    res.json(plant);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plant" });
  }
};

exports.searchPlants = async (req, res) => {
  try {
    const { query } = req.query;
    // ✅ Check kar raha hai ki query aa rahi hai ya nahi

    if (!query || query.trim() === "") {

      return res.status(400).json({ message: "❌ Search query is required" });
    }

    const searchQuery = query.trim();
    console.log("🔍 Step 3: Cleaned Query =", searchQuery);

    const plants = await Plant.find({
      $or: [
        { botanical_name: { $regex: new RegExp(searchQuery, "i") } },
        { common_name: { $regex: new RegExp(searchQuery, "i") } }
      ]
    });



    if (plants.length === 0) {

      return res.status(404).json({ message: "❌ Plant not found in database!" });
    }

    res.json(plants);
  } catch (error) {

    res.status(500).json({ message: "⚠️ Search failed!", error });
  }
};

//  yha pr aurveda ka daata manawange database se 
// yaad rkhna cateory ko small letetrs me save rkhna  ya kuch ar easy leleo 
// A ayurveda ke liuye 
// U -> unnani ke liye 
// N neoropathy ke liye 
// S siddha ke liye 
// H -> homeopathy ke liye 
exports.ayurveda = async (req, res) => {

  try {
    const ayurvedic_plants = await Plant.find({ category: "A" });
    res.json(ayurvedic_plants)
  } catch (err) {
    res.status(500).json({ message: "plants not found ", err });
  }
}

// aise  hi baaakio ka banega 
//  unnai 
exports.unani = async (req,res) => {

  try {
    const unani_plants = await Plant.find({ category: "U" });
    res.json(unani_plants);

  } catch (err) {
    res.status(500).json({ message: "Plants not found ", err });

  }


}

//naturopathy
exports.naturopathy = async (req, res) => {

  try {
    const naturopathy_plants = await Plant.find({ category: "N" });
    res.json(naturopathy_plants);

  } catch (err) {
    res.status(500).json({ message: "Plants not found ", err });
  }
}
// Siddha 

exports.siddha = async (req, res) => {

  try {
    const Siddha_plants = await Plant.find({ category: "S" });
    res.json(Siddha_plants);

  } catch (err) {
    res.status(500).json({ message: "Plants not found ", err });
  }
}

//homeopathy

exports.homeopathy = async (req, res) => {

  try {
    const homeopathy_plants = await Plant.find({ category: "H" });
    res.json(homeopathy_plants);

  } catch (err) {
    res.status(500).json({ message: "Plants not found ", err });
  }
}



