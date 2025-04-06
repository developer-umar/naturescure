const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  common_name: { type: String, required: true },
  botanical_name: { type: String, required: true },
  habitat: { type: String, required: false, default: "" },
  medicine_uses: { type: String, required: false, default: "" },
  method_of_cultivation: { type: String, required: false, default: "" },
  static_image: { type: String, required: false, default: "" },
  models_image: { type: String, required: false, default: "" },
  category: { 
    type: String, 
    required: false, 
    default: "", 
    enum: ["A", "S", "U", "N", "H", ""] // Optional: restrict to valid categories
  }
}, { strict: false });

const Plant = mongoose.model("Plant", plantSchema);
module.exports = Plant;