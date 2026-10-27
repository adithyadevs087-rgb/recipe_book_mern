const express = require("express");
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");

const router = express.Router();

function validId(id) {
  return mongoose.isValidObjectId(id);
}

router.get("/", async (_req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Could not load recipes." });
  }
});

router.get("/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid recipe ID." });
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });
    res.json(recipe);
  } catch {
    res.status(500).json({ message: "Could not load this recipe." });
  }
});

router.post("/", async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message || "Please check the recipe fields." });
  }
});

router.put("/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid recipe ID." });
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message || "Please check the recipe fields." });
  }
});

router.delete("/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid recipe ID." });
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });
    res.json({ message: "Recipe deleted successfully." });
  } catch {
    res.status(500).json({ message: "Could not delete this recipe." });
  }
});

module.exports = router;
