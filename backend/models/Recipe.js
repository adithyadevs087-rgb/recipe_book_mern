const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  category: {
    type: String,
    required: true,
    enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Other"]
  },
  ingredients: { type: String, required: true, trim: true, maxlength: 5000 },
  steps: { type: String, required: true, trim: true, maxlength: 10000 },
  cookingTime: { type: Number, required: true, min: 1, max: 1440 }
}, { timestamps: true });

module.exports = mongoose.model("Recipe", recipeSchema);
