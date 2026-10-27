import React from 'react';
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BookOpen, ChefHat, Clock3, Plus, Search, Pencil, Trash2, Eye,
  X, UtensilsCrossed, Leaf, ArrowUpRight, CheckCircle2, AlertCircle,
  LoaderCircle, CookingPot
} from "lucide-react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const EMPTY = { name: "", category: "Breakfast", ingredients: "", steps: "", cookingTime: "" };
const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Other"];

function getError(error) {
  return error.response?.data?.message || "Something went wrong. Check your connection and try again.";
}

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const notify = (type, message) => {
    setNotice({ type, message });
    window.setTimeout(() => setNotice(null), 3500);
  };

  const loadRecipes = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/recipes`);
      setRecipes(response.data);
    } catch (error) {
      notify("error", getError(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRecipes(); }, [loadRecipes]);

  const visibleRecipes = useMemo(() => recipes.filter((recipe) => {
    const matchesSearch = `${recipe.name} ${recipe.ingredients}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (category === "All" || recipe.category === category);
  }), [recipes, search, category]);

  const changeField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const resetForm = () => {
    setForm(EMPTY);
    setEditingId(null);
    document.getElementById("recipe-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const editRecipe = (recipe) => {
    setForm({
      name: recipe.name,
      category: recipe.category,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      cookingTime: String(recipe.cookingTime)
    });
    setEditingId(recipe._id);
    setSelected(null);
    document.getElementById("recipe-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitRecipe = async (event) => {
    event.preventDefault();
    const payload = { ...form, name: form.name.trim(), ingredients: form.ingredients.trim(),
      steps: form.steps.trim(), cookingTime: Number(form.cookingTime) };
    if (!payload.name || !payload.ingredients || !payload.steps || !payload.category) {
      notify("error", "Please complete every field.");
      return;
    }
    if (!Number.isInteger(payload.cookingTime) || payload.cookingTime < 1 || payload.cookingTime > 1440) {
      notify("error", "Cooking time must be a whole number between 1 and 1440 minutes.");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`${API}/recipes/${editingId}`, payload);
        notify("success", "Recipe updated successfully.");
      } else {
        await axios.post(`${API}/recipes`, payload);
        notify("success", "Your recipe has been saved.");
      }
      setForm(EMPTY);
      setEditingId(null);
      await loadRecipes();
    } catch (error) {
      notify("error", getError(error));
    } finally {
      setSaving(false);
    }
  };

  const deleteRecipe = async (recipe) => {
    if (!window.confirm(`Delete "${recipe.name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/recipes/${recipe._id}`);
      setRecipes((current) => current.filter((item) => item._id !== recipe._id));
      if (selected?._id === recipe._id) setSelected(null);
      if (editingId === recipe._id) { setForm(EMPTY); setEditingId(null); }
      notify("success", "Recipe deleted.");
    } catch (error) {
      notify("error", getError(error));
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Recipe Book home">
          <span className="brand-mark"><CookingPot size={22} /></span>
          <span>little<span className="brand-accent"> thyme</span><small>YOUR PERSONAL RECIPE BOOK</small></span>
        </a>
        <a className="top-link" href="#collection">My collection <ArrowUpRight size={16} /></a>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Leaf size={15} /> GOOD FOOD, GOOD MOOD</div>
            <h1>Your kitchen.<br /><em>Your kind of magic.</em></h1>
            <p>A little place for the recipes you love, the ones you want to try, and the flavours worth remembering.</p>
            <a className="primary-button hero-button" href="#recipe-form"><Plus size={18} /> Add a recipe</a>
            <div className="hero-note"><span className="note-dot" /> Every favourite deserves a place.</div>
          </div>
          <div className="hero-art" aria-label="Illustration of a bowl of fresh food">
            <div className="art-sun" />
            <div className="art-label">MADE WITH LOVE <span>♡</span></div>
            <div className="art-bowl"><div className="bowl-inner">
              <i className="food food-one" /><i className="food food-two" /><i className="food food-three" />
              <i className="food food-four" /><i className="food food-five" /><i className="food food-six" />
              <i className="food food-seven" /><i className="food food-eight" />
            </div></div>
            <div className="art-spark spark-one">✳</div><div className="art-spark spark-two">✦</div>
            <div className="art-caption">fresh ideas<br />start here</div>
          </div>
        </section>

        <section className="stats-row" aria-label="Collection statistics">
          <div><span className="stat-icon"><BookOpen size={18} /></span><strong>{recipes.length}</strong><span>recipes saved</span></div>
          <div><span className="stat-icon"><UtensilsCrossed size={18} /></span><strong>{new Set(recipes.map((r) => r.category)).size}</strong><span>categories explored</span></div>
          <div><span className="stat-icon"><ChefHat size={18} /></span><strong>100%</strong><span>made your way</span></div>
        </section>

        <section className="collection-section" id="collection">
          <div className="section-heading">
            <div><div className="eyebrow">THE GOOD STUFF</div><h2>Your recipe collection<span>.</span></h2><p>All your tried-and-loved dishes, in one happy place.</p></div>
            <span className="collection-count">{visibleRecipes.length} {visibleRecipes.length === 1 ? "recipe" : "recipes"}</span>
          </div>
          <div className="filters">
            <label className="search-box"><Search size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find a recipe or ingredient..." aria-label="Search recipes" /></label>
            <div className="category-filters" aria-label="Filter by category">
              {["All", ...CATEGORIES].map((item) => <button key={item} className={category === item ? "filter-chip active" : "filter-chip"} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
          </div>

          {loading ? <div className="loading-state"><LoaderCircle className="spin" size={26} /><p>Setting the table...</p></div>
          : visibleRecipes.length === 0 ? <div className="empty-state"><span className="empty-icon"><BookOpen size={27} /></span><h3>{recipes.length ? "No recipes found" : "Your collection starts here"}</h3><p>{recipes.length ? "Try another search or category." : "Save your first favourite and make this space yours."}</p><a href="#recipe-form" className="primary-button"><Plus size={17} /> Add your first recipe</a></div>
          : <div className="recipe-grid">{visibleRecipes.map((recipe, index) => (
            <article className="recipe-card" key={recipe._id}>
              <div className={`card-art card-art-${index % 4}`}>
                <span className="card-category">{recipe.category}</span>
                <span className="card-art-icon">{["🥑", "🍋", "🍅", "🥕"][index % 4]}</span>
                <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="card-content">
                <div className="card-meta"><span><Clock3 size={14} /> {recipe.cookingTime} min</span><span className="tiny-leaf">✳</span></div>
                <h3>{recipe.name}</h3>
                <p className="ingredient-preview">{recipe.ingredients.split(/[\n,]/).map(s => s.trim()).filter(Boolean).slice(0, 3).join(" · ")}</p>
                <div className="card-actions">
                  <button className="view-button" onClick={() => setSelected(recipe)}><Eye size={15} /> View recipe</button>
                  <button className="icon-button" title="Edit recipe" aria-label={`Edit ${recipe.name}`} onClick={() => editRecipe(recipe)}><Pencil size={16} /></button>
                  <button className="icon-button delete-icon" title="Delete recipe" aria-label={`Delete ${recipe.name}`} onClick={() => deleteRecipe(recipe)}><Trash2 size={16} /></button>
                </div>
              </div>
            </article>
          ))}</div>}
        </section>

        <section className="form-section" id="recipe-form">
          <div className="form-intro"><div className="eyebrow">PASS IT DOWN</div><h2>{editingId ? "Give it a little update." : "Something delicious?"}<span> Let's save it.</span></h2><p>Write it down now. Thank yourself later.</p><div className="form-doodle">a pinch of this <span>✳</span><br />a little bit of that</div></div>
          <form className="recipe-form" onSubmit={submitRecipe}>
            <div className="form-title"><span className="form-title-icon"><ChefHat size={20} /></span><div><h3>{editingId ? "Edit your recipe" : "New recipe"}</h3><p>Fields marked with * are required.</p></div></div>
            <div className="form-grid">
              <label className="field full"><span>Recipe name *</span><input name="name" value={form.name} onChange={changeField} placeholder="e.g. Sunday morning pancakes" maxLength="100" required /></label>
              <label className="field"><span>Category *</span><select name="category" value={form.category} onChange={changeField} required>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
              <label className="field"><span>Cooking time (minutes) *</span><input name="cookingTime" type="number" min="1" max="1440" step="1" value={form.cookingTime} onChange={changeField} placeholder="e.g. 25" required /></label>
              <label className="field full"><span>Ingredients *</span><textarea name="ingredients" value={form.ingredients} onChange={changeField} placeholder={"2 eggs\n1 cup flour\nA little love..."} rows="4" maxLength="5000" required /></label>
              <label className="field full"><span>Preparation steps *</span><textarea name="steps" value={form.steps} onChange={changeField} placeholder={"1. Get everything ready.\n2. Mix it all together.\n3. Enjoy every bite."} rows="5" maxLength="10000" required /></label>
            </div>
            <div className="form-footer"><p><span>*</span> Made with care, saved forever.</p><div className="form-buttons">{editingId && <button type="button" className="secondary-button" onClick={resetForm}>Cancel</button>}<button type="submit" className="primary-button" disabled={saving}>{saving ? <LoaderCircle className="spin" size={17} /> : editingId ? <CheckCircle2 size={17} /> : <Plus size={18} />}{saving ? "Saving..." : editingId ? "Save changes" : "Save recipe"}</button></div></div>
          </form>
        </section>
      </main>

      <footer className="footer"><a className="footer-brand" href="#home"><CookingPot size={18} /> little thyme</a><span>A collection of things made with love.</span><a href="#home" className="back-top">Back to top ↑</a></footer>

      {notice && <div className={`toast ${notice.type}`} role="status">{notice.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}{notice.message}<button onClick={() => setNotice(null)} aria-label="Dismiss message"><X size={16} /></button></div>}

      {selected && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }} role="presentation">
        <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title">
          <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close details"><X size={20} /></button>
          <div className="details-banner"><span className="card-category">{selected.category}</span><span className="details-emoji">🍽️</span></div>
          <div className="details-body"><div className="details-time"><Clock3 size={16} /> {selected.cookingTime} minutes</div><h2 id="details-title">{selected.name}</h2>
            <div className="details-columns"><div><h3><span>01</span> Ingredients</h3><p className="preserve-lines">{selected.ingredients}</p></div><div><h3><span>02</span> Preparation</h3><p className="preserve-lines">{selected.steps}</p></div></div>
            <div className="details-actions"><button className="secondary-button" onClick={() => editRecipe(selected)}><Pencil size={16} /> Edit recipe</button><button className="primary-button" onClick={() => setSelected(null)}>Lovely, got it <CheckCircle2 size={16} /></button></div>
          </div>
        </section>
      </div>}
    </div>
  );
}
